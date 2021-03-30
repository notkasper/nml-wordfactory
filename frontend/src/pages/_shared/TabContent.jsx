const TabContent = (props) => {
  const { value, index, children } = props;
  if (value !== index) {
    return null;
  }
  return children;
};

export default TabContent;
