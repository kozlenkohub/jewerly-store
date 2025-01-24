import ContentLoader from 'react-content-loader';

const RectangleSkeleton = () => (
  <ContentLoader
    speed={2}
    width={400}
    height={200}
    viewBox="0 0 400 200"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb">
    <rect x="0" y="0" rx="0" ry="0" width="100%" height="100%" />
  </ContentLoader>
);

export { RectangleSkeleton };
