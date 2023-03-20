import { useRef, useEffect } from 'react'

const isAbortControllerSupported = window.hasOwnProperty('AbortController')
const noOp = () => null

const initAbortController = () => (isAbortControllerSupported ? new AbortController() : {
    abort: noOp,
    signal: {
        aborted: false,
    }
})


export const useAbortController = (shouldAutoRestart = false) => {

    const abortController = useRef(initAbortController())

    useEffect(() => {

        if (shouldAutoRestart && abortController.current.signal.aborted) {
            abortController.current = initAbortController()
        }

    }, [ shouldAutoRestart, abortController?.current?.signal?.aborted ])

    useEffect(() => {

        return () => {
            abortController.current.abort()
        }

    }, [ abortController.current ])

    return abortController.current;
}