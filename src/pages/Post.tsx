import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getNewPosts, getPost, getRelatedPosts } from '../services/postsAPI';

import tick from '../assets/svg/tick.svg';

import Loader from '../components/Loader';
import Page404 from './Page404';
import Disclaimer from '../views/Disclaimer';
import HorizontalAdBanner from '../views/HorizontalAdBanner';
import RenderDescription from '../components/RenderDescription';
import AdList from '../components/AdList';
import InfinitePost from '../components/InfinitePost';
import { io } from 'socket.io-client';

const socket = io('http://localhost:1337');

const Post = () => {
  const [post, setPost] = useState({});
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { pathname } = useLocation();
  const postId = pathname.split('/').pop();
  const [postIds, setPostIds] = useState([]);

  const [activeUsers, setActiveUsers] = useState({});

  useEffect(() => {
    // Отримуємо дані про активних користувачів для всіх постів при підключенні
    socket.on('updateAllActiveUsers', data => {
      setActiveUsers(data);
    });

    // Оновлення кількості активних користувачів для конкретного поста
    socket.on('updateActiveUsers', ({ postId, count }) => {
      setActiveUsers(prev => ({
        ...prev,
        [postId]: count,
      }));
    });

    return () => {
      socket.off('updateAllActiveUsers');
      socket.off('updateActiveUsers');
    };
  }, [postId]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const post = await getPost(postId);
        const related = await getRelatedPosts();
        const ids = await getNewPosts();
        setPostIds(ids.data.map(post => post.documentId));
        setRelatedPosts(related.data);
        setPost(post.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    // Підключаємося до WebSocket
    socket.emit('joinPost', postId); // Сповіщаємо сервер, що користувач приєднався

    // Слухаємо оновлення активних користувачів
    socket.on('updateActiveUsers', data => {
      if (data.postId === postId) {
        setActiveUsers(prevActiveUsers => ({
          ...prevActiveUsers,
          [postId]: data.count,
        }));
      }
    });

    return () => {
      // Відключаємо WebSocket при зміні сторінки або видаленні компонента
      socket.emit('leavePost', postId); // Сповіщаємо сервер, що користувач покидає пост
      socket.off('updateActiveUsers'); // Очищаємо слухачів
    };
  }, [postId]);

  if (isLoading) {
    return <Loader />;
  }

  if (!post || Object.keys(post).length === 0) {
    return <Page404 />;
  }

  const filteredPostIds = postIds?.filter(id => id !== postId);

  // Отримуємо кількість користувачів для кожного з пов'язаних постів
  const getReadingCount = postId => activeUsers[postId] || 0;

  return (
    <div>
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
            <div className="flex justify-between items-center border-t border-b border-gray-300 py-4 my-4 flex-wrap">
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
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <Disclaimer />
      <InfinitePost
        postIds={filteredPostIds}
        getReadingCount={getReadingCount}
      />
    </div>
  );
};

export default Post;
