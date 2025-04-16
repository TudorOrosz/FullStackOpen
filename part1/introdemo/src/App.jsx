const Header = (props) => {
  console.log(props)
  return (
    <div>
      <p> Course name: {props.course}</p>
      <p> Course content: {props.course}</p>
    </div>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <>
      <Header course={course} />
      <Content part1={part1} part2={part2} part3={part3} />
      <Total total={exercises1+exercises2+exercises3} />
    </>
  )
}

export default App