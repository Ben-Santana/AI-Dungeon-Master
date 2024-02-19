import { useEffect } from "react";

// Updates the height of a <textarea> when the value changes.
const useAutosizeTextArea = (
  textAreaRef: HTMLTextAreaElement | null,
  value: string
) => {
  useEffect(() => {
    console.log(textAreaRef?.scrollHeight);
    if (textAreaRef && textAreaRef.scrollHeight < 250) {
      // Resets the height momentarily to get the correct scrollHeight for the textarea
      textAreaRef.style.height = "0px";

      // Set the height directly, outside of the render loop
      // Trying to set this with state or a ref will produce an incorrect value.
        textAreaRef.style.height = textAreaRef.scrollHeight + "px";
    }
  }, [textAreaRef, value]);
};

export default useAutosizeTextArea;
