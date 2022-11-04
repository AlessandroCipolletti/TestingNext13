import React from "react"
import PropTypes from "prop-types"


const MyComponent2 = ({
  prop = "value",
}) => {

  return <div>{prop}</div>
}

MyComponent2.propTypes = {
  prop: PropTypes.string,
}

MyComponent2.isPublic = true

export default MyComponent2