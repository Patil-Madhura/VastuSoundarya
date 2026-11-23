import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjects, getProjectById, getCategories } from '../services/apiService';
import ProjectCard from '../components/ProjectCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(['All', ...res.data.map((c) => c.name)]))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = activeCategory !== 'All' ? { category: activeCategory } : {};
    getProjects(params)
      .then((res) => setProjects(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <>
      <section className="relative py-32 bg-charcoal-900">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920"
            alt="Projects"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl text-white mb-4">Our Projects</h1>
          <p className="text-charcoal-300 text-lg">Explore our portfolio of completed and ongoing work</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 text-sm uppercase tracking-wider transition-all ${
                  activeCategory === cat
                    ? 'bg-gold-600 text-white'
                    : 'bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <LoadingSpinner className="py-20" />
          ) : projects.length === 0 ? (
            <p className="text-center text-charcoal-500">No projects found in this category.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    getProjectById(id)
      .then((res) => {
        setProject(res.data);
        if (res.data?.name) {
          document.title = `${res.data.name} | VastuSoundarya Architects & Interiors`;
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner className="py-32" />;
  if (!project) {
    return (
      <div className="section-padding text-center">
        <h2 className="text-2xl mb-4">Project not found</h2>
        <Link to="/projects" className="text-gold-600">Back to Projects</Link>
      </div>
    );
  }

  const images = project.images?.length
    ? project.images
    : [{ url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800' }];

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <Link to="/projects" className="text-gold-600 text-sm mb-6 inline-block hover:text-gold-700">
          &larr; Back to Projects
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className="aspect-[4/3] overflow-hidden bg-charcoal-100 mb-4">
              <img
                src={images[activeImage].url}
                alt={project.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 overflow-hidden border-2 ${
                      activeImage === idx ? 'border-gold-600' : 'border-transparent'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <span className="text-gold-600 uppercase tracking-wider text-sm">{project.category}</span>
            <h1 className="font-display text-3xl md:text-4xl mt-2 mb-4">{project.name}</h1>
            <p className="text-charcoal-500 mb-6">{project.location}</p>

            <div className="flex gap-4 mb-6">
              <span
                className={`text-xs uppercase tracking-wider px-3 py-1 ${
                  project.status === 'Completed'
                    ? 'bg-green-100 text-green-700'
                    : project.status === 'Ongoing'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {project.status}
              </span>
              {project.completionInfo && (
                <span className="text-sm text-charcoal-500">{project.completionInfo}</span>
              )}
            </div>

            <p className="text-charcoal-600 leading-relaxed">{project.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
