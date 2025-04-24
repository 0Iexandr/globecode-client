import { useEffect, useState, useRef, useCallback } from 'react';
import { getPost, getRelatedPosts } from '../services/postsAPI';
import { Link } from 'react-router-dom';

import tick from '../assets/svg/tick.svg';

import Loader from '../components/Loader';
import RenderDescription from '../components/RenderDescription';
import AdList from '../components/AdList';
import Page404 from '../pages/Page404';
import HorizontalAdBanner from '../views/HorizontalAdBanner';
import Disclaimer from '../views/Disclaimer';

const InfinitePost = ({ postIds, getReadingCount }) => {
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const observer = useRef(null);

  const loadedPostIds = useRef(new Set());

  const loadPost = useCallback(async () => {
    if (isLoading || currentIndex >= postIds.length) return;
    setIsLoading(true);
    try {
      const response = await getPost(postIds[currentIndex]);
      const newPost = response.data;
      const related = await getRelatedPosts();
      setRelatedPosts(related.data);

      if (!loadedPostIds.current.has(newPost.documentId)) {
        loadedPostIds.current.add(newPost.documentId);
        setPosts(prevPosts => [...prevPosts, newPost]);
      }
      setCurrentIndex(prevIndex => prevIndex + 1);
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, currentIndex, postIds]);

  useEffect(() => {
    if (postIds.length > 0 && posts.length === 0) {
      loadPost();
    }
  }, [loadPost, postIds.length, posts.length]);

  const lastPostRef = useCallback(
    node => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          loadPost();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, loadPost],
  );

  if (!posts.length && !isLoading) {
    return <Page404 />;
  }

  return (
    <div>
      {posts.map((post, index) => (
        <div
          key={post.documentId}
          ref={index === posts.length - 1 ? lastPostRef : null}
        >
          <HorizontalAdBanner
            image={post.firstAdBanner.image.url}
            url={post.firstAdBanner.url}
          />
          <section className="container mx-auto py-8">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
              <div className="lg:col-span-7">
                <h2 className="section__title text-4xl font-bold mb-4">
                  {post.title}
                </h2>
                <span className="section__title block text-lg text-green-600 mb-4">
                  {post.category.name}
                </span>
                <div className="flex justify-between items-center border-t border-b border-gray-300 py-4 my-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={`http://localhost:1337${post.author.avatar.url}`}
                      alt={post.author.name}
                      className="rounded-full w-8 h-8"
                    />
                    <h5 className="section__description font-semibold">
                      By{' '}
                      <Link
                        to={`/author/${post.author.documentId}`}
                        className="underline text-green-600"
                      >
                        {post.author.name}
                      </Link>
                    </h5>
                    <img src={tick} alt="tick" className="w-6 h-6" />
                  </div>
                  <p className="section__description text-base text-gray-700">
                    Created at:{' '}
                    {new Intl.DateTimeFormat('en-US', {
                      month: 'short',
                      day: '2-digit',
                      year: 'numeric',
                    }).format(new Date(post.createdAt))}
                  </p>
                </div>
                <RenderDescription
                  description={post.description}
                  className="section__description text-base text-gray-700 mb-6"
                />
                <AdList ads={post.ads} />
                <img
                  src={`http://localhost:1337${post.image.url}`}
                  alt={post.title}
                  className="w-full object-cover rounded mb-6"
                />
                {post.paragraphs.map(
                  ({ id, subtitle, description, image, ads }) => (
                    <div key={id} className="mb-8">
                      <h3 className="section__title text-2xl font-semibold mb-2">
                        {subtitle}
                      </h3>
                      <RenderDescription
                        description={description}
                        className="section__description text-base text-gray-700 mb-4"
                      />
                      <AdList ads={ads} />
                      <img
                        src={`http://localhost:1337${image.url}`}
                        alt={subtitle}
                        className="w-full object-cover rounded"
                      />
                    </div>
                  ),
                )}
              </div>

              <div className="lg:col-span-3 space-y-8">
                <div>
                  <h3 className="section__title text-2xl font-bold mb-4">
                    Advertisements
                  </h3>
                  <a
                    href={post.secondAdBanner.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={`http://localhost:1337${post.secondAdBanner.image.url}`}
                      alt="advertisement"
                      className="w-full border-gray-400 border-[1px]"
                    />
                  </a>
                </div>

                <div>
                  <h3 className="section__title text-2xl font-bold mb-4">
                    Related Posts
                  </h3>
                  <ul className="space-y-4">
                    {relatedPosts.map(
                      ({ documentId, image, title, category }) => (
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
                              <p className="text-sm text-gray-600 dark:text-slate-200">
                                {getReadingCount(documentId)} reading now
                              </p>
                            </div>
                            <img
                              src={`http://localhost:1337${image.url}`}
                              alt={title}
                              className="w-16 h-16 object-cover rounded"
                            />
                          </Link>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </section>
          <Disclaimer />
        </div>
      ))}
      {isLoading && <Loader />}
    </div>
  );
};

export default InfinitePost;
