import React from "react"
import PropTypes from "prop-types"


const MyComponent = ({
  prop = "value",
}) => {

  return <div>{prop}</div>
}

MyComponent.propTypes = {
  prop: PropTypes.string,
}

export default MyComponent