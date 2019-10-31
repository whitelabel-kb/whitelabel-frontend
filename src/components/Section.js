export default (props) => {
  const { children, className, style } = props
  return (
    <section className={className} style={style}>
      { children }
    </section>
  )
}
