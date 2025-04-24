import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getSearchedPosts } from '../services/postsAPI';

import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import Categories from '../views/Categories';
import RenderDescription from '../components/RenderDescription';

const Search = ({ categories }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const pageSize = 10;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('query');

  useEffect(() => {
    if (!query || query.length < 3) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const posts = await getSearchedPosts(query, currentPage, pageSize);
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
  }, [query, currentPage]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <section className="container pt-12">
        <h2 className="section__title mb-6 text-green-600 break-words">
          Search results for: "{query}"
        </h2>
        {posts.length > 0 ? (
          <div>
            <ul className="grid gap-4">
              {posts.map(
                ({ documentId, image, title, description, category }) => (
                  <Link
                    key={documentId}
                    to={`/post/${documentId}`}
                    className="flex gap-4 items-start p-4 rounded-lg transition duration-300 hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-900 border shadow-sm"
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
            </ul>
            <Pagination
              currentPage={currentPage}
              totalPages={pageCount}
              onPageChange={setCurrentPage}
            />
          </div>
        ) : (
          !isLoading && <p className="section__description">Nothing found 😕</p>
        )}
      </section>
      <Categories categories={categories} />
    </div>
  );
};

export default Search;
