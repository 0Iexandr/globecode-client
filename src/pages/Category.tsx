import { Link, useLocation } from 'react-router-dom';
import {
  getCategory,
  getPostsByCategory,
  getRelatedPosts,
} from '../services/postsAPI';
import { useEffect, useState } from 'react';

import Loader from '../components/Loader';
import Page404 from './Page404';
import Pagination from '../components/Pagination';
import Disclaimer from '../views/Disclaimer';
import RenderDescription from '../components/RenderDescription';

const Category = () => {
  const [category, setCategory] = useState({});
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { pathname } = useLocation();
  const categoryId = pathname.split('/').pop();
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const category = await getCategory(categoryId);
        const posts = await getPostsByCategory(
          categoryId,
          currentPage,
          pageSize,
        );
        const related = await getRelatedPosts();
        setCategory(category.data);
        setRelatedPosts(related.data);
        setPosts(posts.data);
        setPageCount(posts.meta.pagination.pageCount);
        window.scrollTo(0, 0);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [categoryId, currentPage]);

  if (isLoading) {
    return <Loader />;
  }

  if (!category || Object.keys(category).length === 0) {
    return <Page404 />;
  }

  return (
    <div>
      <section className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          <div className="lg:col-span-7">
            <div className="relative vignette-container">
              <img
                src={category.image.url}
                alt={category.name}
                className="w-full object-cover rounded mb-6"
              />
              <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 p-4 z-40 rounded">
                <h2 className="font-inter text-white md:text-4xl text-xl font-bold text-left">
                  {category.name}
                </h2>
              </div>
            </div>

            {posts?.map(
              ({ documentId, image, title, description, category }) => (
                <Link
                  key={documentId}
                  to={`/post/${documentId}`}
                  className="flex gap-4 items-start p-4 rounded-lg transition duration-300 hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-900"
                >
                  <img
                    src={image.url}
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
              ),
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={pageCount}
              onPageChange={setCurrentPage}
            />
          </div>

          <div className="lg:col-span-3 space-y-8">
            <div>
              <h3 className="section__title text-2xl font-bold mb-4">
                Related Posts
              </h3>
              <ul className="space-y-4">
                {relatedPosts.map(({ documentId, image, title, category }) => (
                  <li key={documentId}>
                    <Link
                      to={`/post/${documentId}`}
                      className="flex items-center p-4 border border-gray-200 rounded hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                    >
                      <div className="flex-1 pr-4">
                        <h4 className="section__title text-lg font-medium text-gray-800">
                          {title}
                        </h4>
                        <p className="section__title text-sm text-green-600 dark:text-green-600">
                          {category.name}
                        </p>
                      </div>
                      <img
                        src={image.url}
                        alt={title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <Disclaimer />
    </div>
  );
};

export default Category;
