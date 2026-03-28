import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa6';
import MediaCard from './MediaCard';

const ViewMoreCard = ({ to = '/' }) => (
  <MediaCard>
    <div className="card-body d-flex flex-column align-items-center justify-content-center text-center">
      <Link to={to} className="text-muted see-more-card d-flex justify-content-center align-items-center fs-4 p-3 rounded-circle">
        <FaArrowRight />
      </Link>
    </div>
  </MediaCard>
);

export default ViewMoreCard;
