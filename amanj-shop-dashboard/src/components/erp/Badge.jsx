import { getStatusColor } from './helpers';

export default function Badge({ statuses, children }) {
  const className = `${getStatusColor(statuses)} badge`;
  return <span className={className}>{children || statuses}</span>;
}
