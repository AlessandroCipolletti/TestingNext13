import React from "react"
import PropTypes from "prop-types"


const MyComponent3 = ({
  prop = "value",
}) => {

  return <div>{prop}</div>
}

MyComponent3.propTypes = {
  prop: PropTypes.string,
}

MyComponent3.isPublic = true

export default MyComponent3