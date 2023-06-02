import { PropNames, EventModifierPropNames, EventModifierProps } from "../types"

type ValidHTMLElements = {
  div: {
    hello: string
    className: string
    onClick: (e: MouseEvent) => void
    onSubmit: (e: SubmitEvent) => void
  }
}

type HasValue<T, UnionTypes> = T extends UnionTypes ? true : false
type HasKey<T, K> = K extends keyof T ? true : false

test("Prop names are correctly extracted", () => {
  type Names = PropNames<ValidHTMLElements, "div">

  expect(false satisfies HasValue<Names, "asdadsd">).toBeFalsy()
  expect(true satisfies HasValue<Names, "hello">).toBeTruthy()
  expect(true satisfies HasValue<Names, "className">).toBeTruthy()
  expect(true satisfies HasValue<Names, "onClick">).toBeTruthy()
  expect(true satisfies HasValue<Names, "onSubmit">).toBeTruthy()
})

test("Event modifiable prop names are correctly extracted", () => {
  type Names = EventModifierPropNames<ValidHTMLElements, "div">

  expect(false satisfies HasValue<Names, "asdadsd">).toBeFalsy()
  expect(false satisfies HasValue<Names, "hello">).toBeFalsy()
  expect(false satisfies HasValue<Names, "className">).toBeFalsy()
  expect(true satisfies HasValue<Names, "onClick">).toBeTruthy()
  expect(true satisfies HasValue<Names, "onSubmit">).toBeTruthy()
})

test("Event modifiable props are correctly extracted", () => {
  type Names = EventModifierProps<ValidHTMLElements, "div">

  expect(true satisfies HasKey<Names, "onClick-stopPropagation">).toBeTruthy()
  expect(true satisfies HasKey<Names, "onSubmit-stopPropagation">).toBeTruthy()
  expect(true satisfies HasKey<Names, "onClick-preventDefault">).toBeTruthy()
  expect(true satisfies HasKey<Names, "onSubmit-preventDefault">).toBeTruthy()
  expect(
    true satisfies HasKey<Names, "onClick-preventDefault-stopPropagation">
  ).toBeTruthy()
  expect(
    true satisfies HasKey<Names, "onSubmit-preventDefault-stopPropagation">
  ).toBeTruthy()

  expect(false satisfies HasValue<Names, "asdadsd">).toBeFalsy()
  expect(false satisfies HasKey<Names, "onClick">).toBeFalsy() // original functions come from element
  expect(false satisfies HasKey<Names, "onSubmit">).toBeFalsy() // original functions come from element
  expect(
    false satisfies HasKey<Names, "onClick-stopPropagation-preventDefault">
  ).toBeFalsy()
  expect(
    false satisfies HasKey<Names, "onSubmit-stopPropagation-preventDefault">
  ).toBeFalsy()
})
