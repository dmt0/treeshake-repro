import PropTypes from 'prop-types';
import Icon from '@mdi/react';
import {
  mdiNotebookOutline,
  mdiFolder,
  mdiChartBoxOutline,
  mdiGrid,
  mdiTableMultiple,
  mdiTextBoxOutline,
  mdiViewDashboardOutline,
  mdiImageOutline,
  mdiFolderMultiple,
  mdiEarth,
} from '@mdi/js';

// TODO connect with READABLE_TYPES
const types = {
  jupyter_notebook: {icon: mdiNotebookOutline},
  fold: {icon: mdiFolder},
  dash_app: {icon: mdiFolder},
  plot: {icon: mdiChartBoxOutline},
  grid: {icon: mdiGrid},
  grid_alt: {icon: mdiGrid},
  dashboard: {icon: mdiTableMultiple},
  html_text: {icon: mdiTextBoxOutline},
  figure: {icon: mdiViewDashboardOutline},
  external_image: {icon: mdiImageOutline},
  my_files: {icon: mdiFolderMultiple},
  public_content: {icon: mdiEarth},
};

const FileIcon = ({type, className = ''}) => <Icon className={className} path={types[type].icon} />;

FileIcon.propTypes = {
  type: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default FileIcon;
