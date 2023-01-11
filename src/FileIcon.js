import PropTypes from 'prop-types';
import Icon from '@mdi/react';
import {
  mdiTextBoxOutline,
  mdiImageOutline,
  mdiFolderMultiple,
  mdiEarth,
} from '@mdi/js';

// TODO connect with READABLE_TYPES
const types = {
  html_text: {icon: mdiTextBoxOutline},
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
