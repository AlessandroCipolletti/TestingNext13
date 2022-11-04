import React from "react"
import PropTypes from "prop-types"


const MyComponent1 = ({
  prop = "value",
}) => {

  return <div>{prop}</div>
}

MyComponent1.propTypes = {
  prop: PropTypes.string,
}

MyComponent1.isPublic = true

export default MyComponent1