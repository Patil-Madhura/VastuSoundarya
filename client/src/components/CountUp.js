import { useEffect, useRef, useState } from 'react';

// Smooth cubic ease-out curve: accelerates quickly and gently decelerates to the final value
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/**
 * Parses numeric value, prefix, and suffix.
 * Handles numbers (e.g. 15) and formatted strings (e.g. "15+", "200+", "100%").
 */
const parseValue = (val, explicitPrefix, explicitSuffix) => {
  if (typeof val === 'number') {
    return {
      num: val,
      prefix: explicitPrefix ?? '',
      suffix: explicitSuffix ?? '',
      isValid: !isNaN(val),
    };
  }

  const str = String(val ?? '').trim();
  const match = str.match(/^([^\d]*?)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) {
    return {
      num: 0,
      prefix: explicitPrefix ?? '',
      suffix: explicitSuffix ?? str,
      isValid: false,
      raw: str,
    };
  }

  return {
    num: parseFloat(match[2]),
    prefix: explicitPrefix ?? match[1],
    suffix: explicitSuffix ?? match[3],
    isValid: true,
  };
};

const CountUp = ({
  end,
  value,
  start = 0,
  duration = 1800, // 1.8 seconds duration (smooth, professional 1.5 - 2s range)
  prefix,
  suffix,
  decimals = 0,
  className = '',
}) => {
  const targetInput = end !== undefined ? end : value;
  const { num, prefix: resolvedPrefix, suffix: resolvedSuffix, isValid, raw } = parseValue(
    targetInput,
    prefix,
    suffix
  );

  const [count, setCount] = useState(start);
  const elementRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const rafIdRef = useRef(null);

  useEffect(() => {
    if (!isValid) return;

    const element = elementRef.current;
    if (!element) return;

    // Respect prefers-reduced-motion accessibility setting
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setCount(num);
      return;
    }

    const startAnimation = () => {
      let startTime = null;
      const initial = start;
      const difference = num - initial;

      if (difference === 0) {
        setCount(num);
        return;
      }

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const currentVal = initial + difference * easedProgress;

        setCount(
          decimals > 0
            ? parseFloat(currentVal.toFixed(decimals))
            : Math.round(currentVal)
        );

        if (progress < 1) {
          rafIdRef.current = requestAnimationFrame(animate);
        } else {
          setCount(num);
        }
      };

      rafIdRef.current = requestAnimationFrame(animate);
    };

    if (typeof IntersectionObserver === 'undefined') {
      startAnimation();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          startAnimation();
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [num, start, duration, decimals, isValid]);

  if (!isValid && raw) {
    return <span className={className}>{raw}</span>;
  }

  const formattedNumber =
    decimals > 0
      ? count.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : count.toLocaleString();

  return (
    <span ref={elementRef} className={className}>
      {resolvedPrefix}
      {formattedNumber}
      {resolvedSuffix}
    </span>
  );
};

export default CountUp;
