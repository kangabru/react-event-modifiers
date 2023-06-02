import { useRef } from "react"
import mod from "react-event-modifiers"

export default function TestPage() {
  const ref = useRef<HTMLDivElement>(null)
  const doSomethingWithRef = () => console.log("Ref", ref.current)
  return (
    <main
      className="w-full max-w-screen-sm mx-auto p-10 m-10 bg-gray-100 rounded-2xl space-y-4"
      onClick={() => console.log("You've clicked on <main>")}
    >
      <p className="text-xl">Open dev tools and click on elements below</p>

      <div onClick={logElementName}>DIV: Normal</div>

      <div onClick={doSomethingWithRef}>DIV: Normal + Ref</div>

      <mod.div ref={ref} onClick-stopPropagation={logElementName}>
        DIV: StopPropagation
      </mod.div>

      <mod.div onClick-stopPropagation>DIV: StopPropagation with flag</mod.div>

      <form>
        <button type="submit">FORM: Normal</button>
      </form>

      <mod.form onSubmit-preventDefault={logElementName}>
        <button type="submit">FORM: PreventDefault</button>
      </mod.form>

      <mod.form
        onClick-stopPropagation
        onSubmit-preventDefault={logElementName}
      >
        <button type="submit">
          FORM: PreventDefault and Click StopPropagation
        </button>
      </mod.form>
    </main>
  )
}

function logElementName(e: any) {
  console.log(`You've clicked on [${e.currentTarget.innerText}]`)
}
