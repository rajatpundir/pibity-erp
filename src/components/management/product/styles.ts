import styled from '@emotion/styled'

type h1Props = {
    fontSize: number
    color: 'orange'
}

export const H1 = styled.h1<h1Props>(
    {
        fontSize: 20,
        color: 'red'
    },
    props => ({ color: props.color })
)
