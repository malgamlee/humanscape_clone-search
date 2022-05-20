import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { debounce } from 'lodash'

import { useAppDispatch } from 'hooks'

import { getSearchDiseasesApi } from 'services/search'

import { setDisease } from 'states/disease'

import styles from './SearchDiseases.module.scss'

import SearchList from './SearchList/SearchList'

const SearchDiseases = () => {
  const [inputValue, setInputValue] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)

  const dispatch = useAppDispatch()

  const { data } = useQuery(
    ['getDiseaseNameApi', inputValue],
    () =>
      getSearchDiseasesApi({ searchText: inputValue }).then((res) => {
        // eslint-disable-next-line no-console
        console.count('API Call')
        if (res.data.response.body.totalCount > 0) setIsOpen(true)
        return res.data.response.body.items.item
      }),
    {
      enabled: !!inputValue,
      staleTime: 2 * 60 * 1000,
    }
  )

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const debouncedChangeHandler = useMemo(() => debounce(handleChange, 1000), [])

  useEffect(() => {
    if (data) {
      dispatch(setDisease(data))
    }
  }, [data])

  return (
    <div className={styles.bg}>
      <div className={styles.bgCenter}>
        <div className={styles.container}>
          <div className={styles.searchContainer}>
            <h1>
              <div>국내 모든 임상시험 검색하고</div> 온라인으로 참여하기
            </h1>
            <form className={styles.searchWrapper} onSubmit={handleSubmit}>
              <div className={styles.inputWrapper}>
                <input type='text' placeholder='질환명을 입력해 주세요.' onChange={debouncedChangeHandler} />
              </div>
              <button type='submit' className={styles.searchTextbox}>
                검색
              </button>
            </form>
            {isOpen && <SearchList isOpen={isOpen} setIsOpen={setIsOpen} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchDiseases
