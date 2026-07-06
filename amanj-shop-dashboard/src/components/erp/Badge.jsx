import { getStatusColor } from './helpers';

export default function Badge({ status, children }) {
  const className = `${getStatusColor(status)} badge`;
  return <span className={className}>{children || status}</span>;
}
