import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC } from 'react'
import { SizeProp } from '@fortawesome/fontawesome-svg-core'

type Props = {
  size?: SizeProp
}

const IconAdmin: FC<Props> = ({ size }) => {
  return (
    <FontAwesomeIcon
      icon={['fas', 'wrench']}
      size={size}
      className={'text-warning'}
    />
  )
}

export default IconAdmin
