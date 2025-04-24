import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAuthor, getPostsByAuthor } from '../services/postsAPI';

import Loader from '../components/Loader';
import Page404 from './Page404';
import RenderDescription from '../components/RenderDescription';
import Pagination from '../components/Pagination';

const Author = () => {
  const { pathname } = useLocation();
  const authorId = pathname.split('/').pop();
  const [isLoading, setIsLoading] = useState(true);
  const [author, setAuthor] = useState({});
  const [posts, setPosts] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const author = await getAuthor(authorId);
        const posts = await getPostsByAuthor(authorId, currentPage, pageSize);
        setAuthor(author.data);
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
  }, [authorId]);

  if (isLoading) {
    return <Loader />;
  }

  if (!author || Object.keys(author).length === 0) {
    return <Page404 />;
  }

  return (
    <div>
      <section>
        <div className="bg-slate-50 section__padding dark:bg-gray-900">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <img
                src={`http://localhost:1337${author.avatar.url}`}
                alt={author.name}
                className="rounded-full max-w-52 max-h-52 border-[30px] border-white"
              />
              <div>
                <h4 className="section__title pb-4">{author.name}</h4>
                <RenderDescription
                  description={author.description}
                  className="section__description"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="container section__padding">
          <h4 className="section__title pb-4">Latest from {author.name}:</h4>
          {posts?.map(({ documentId, image, title, description, category }) => (
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
          <Pagination
            currentPage={currentPage}
            totalPages={pageCount}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>
    </div>
  );
};

export default Author;
