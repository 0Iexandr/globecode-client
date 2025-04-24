import { useEffect, useState } from 'react';
import { getPopularPosts } from '../services/postsAPI';

import Loader from '../components/Loader';
import Page404 from '../pages/Page404';
import { Link } from 'react-router-dom';
import RenderDescription from '../components/RenderDescription';

const Hero = () => {
  const [popularPosts, setPopularPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getPopularPosts();
        setPopularPosts(data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (popularPosts.length === 0) {
    return <Page404 />;
  }

  return (
    <section className="container section__padding pt-8">
      <h1 className="section__title mb-6">Nice Advice</h1>
      {popularPosts && popularPosts.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            to={`/post/${popularPosts[0].documentId}`}
            className="block group p-4 hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg"
          >
            <div className="w-full h-96 overflow-hidden rounded-lg">
              <img
                src={`http://localhost:1337${popularPosts[0].image.url}`}
                alt={popularPosts[0].title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300"
              />
            </div>
            <div className="mt-4">
              <span className="text-green-600 section__title dark:text-green-600 text-sm">
                {popularPosts[0].category.name}
              </span>
              <h2 className="section__title">{popularPosts[0].title}</h2>
              <RenderDescription
                description={popularPosts[0].description}
                className="section__description mt-2 text-lg"
                truncate={true}
              />
            </div>
          </Link>

          <div className="flex flex-col gap-4">
            {popularPosts
              .slice(1)
              .map(({ documentId, image, title, description, category }) => (
                <Link
                  key={documentId}
                  to={`/post/${documentId}`}
                  className="flex gap-4 items-start p-4 rounded-lg transition duration-300 hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-900"
                >
                  <img
                    src={`http://localhost:1337${image.url}`}
                    alt={title}
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <span className="text-green-600 section__title dark:text-green-600 text-sm">
                      {category.name}
                    </span>
                    <h3 className="section__title text-xl">{title}</h3>
                    <RenderDescription
                      description={description}
                      className="section__description text-base mt-1"
                      truncate={true}
                    />
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
