const Total = (props) => {
  return (
      <p style={props.style}> total of {props.course.parts.reduce((sum, part) => sum + part.exercises, 0)} exercises</p>
  )
}

const Courses = ({ courses }) => {
  return (
    <div>
      <h1>Web development curriculum</h1>
      {courses.map(course=>
        <div key = {course.id}>
          <h3>{course.name}</h3>
          <div>
            {course.parts.map(part =>
              <div key={part.id}>
                {part.name} {part.exercises}
              </div>             
            )}
            <Total course={course} style={{fontWeight: 'bold'}}/>
          </div>
        </div>     
      )}
    </div>
  )
}

export default Courses