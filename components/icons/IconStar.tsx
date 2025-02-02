import iconStyles from './Icon.module.css'
import styles from './IconStar.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSession } from 'next-auth/react'
import { isLogin } from '../../lib/session'
import LoginModal from '../modals/LoginModal'
import { FC, useState } from 'react'
import useSWR from 'swr'
import { postData } from '../../lib/utils'
import { SizeProp } from '@fortawesome/fontawesome-svg-core'
import { Item } from '../../types/Item'
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons/faStar'

type Props = {
  item: Item
  size?: SizeProp
}

const IconStar: FC<Props> = ({ item, size }) => {
  const { data: session } = useSession()
  const [show, setShow] = useState(false)
  const [isFav, setIsFav] = useState(false)
  const [userFav, setUserFav] = useState([])
  const { data: user } = useSWR('/api/user/me')

  if (user && user.favs) {
    const diff = userFav
      .filter((x) => !user.favs.includes(x))
      .concat(user.favs.filter((x) => !userFav.includes(x)))
    if (diff.length > 0) {
      setUserFav(user.favs)
      setIsFav(user.favs.includes(item._id))
    }
  }

  return (
    <>
      <span
        className={iconStyles.icon + ' ' + styles.star}
        data-tip={(isFav ? 'Un-star' : 'Star') + ' item'}
        onClick={() => {
          if (isLogin(session)) {
            user.favs = isFav
              ? user.favs.filter((f) => f !== item._id)
              : user.favs.concat([item._id])
            let body = {
              uid: 'me',
              favs: user.favs,
            }

            postData('/api/edit/user', body, () => {
              setIsFav(!isFav)
            })
          } else {
            setShow(true)
          }
        }}
      >
        <FontAwesomeIcon icon={isFav ? faStar : farStar} size={size} />
      </span>
      {show && (
        <LoginModal
          text={'Cannot mark item as favourite for non existing user'}
          close={() => setShow(false)}
        />
      )}
    </>
  )
}

export default IconStar
