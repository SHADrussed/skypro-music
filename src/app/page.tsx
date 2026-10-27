import "./page.css";
import Image from "next/image";

export default function Home() {
  return (
    <div className={"wrapper"}>
      <div className={"container"}>
        <main className={"main"}>
          <nav className={"main__nav"}>
            <div className={"nav__logo"}>
              <Image
                width={250}
                height={170}
                className={"logo__image"}
                src="/logo.png"
                alt={"logo"}
              />
            </div>
            <div className={"nav__burger"}>
              <span className={"burger__line"}></span>
              <span className={"burger__line"}></span>
              <span className={"burger__line"}></span>
            </div>
            <div className={"nav__menu"}>
              <ul className={"menu__list"}>
                <li className={"menu__item"}>
                  {/*TODO: a -> Link*/}
                  <a href="#" className={"menu__link"}>
                    Главное
                  </a>
                </li>
                <li className={"menu__item"}>
                  <a href="#" className={"menu__link"}>
                    Мой плейлист
                  </a>
                </li>
                <li className={"menu__item"}>
                  <a href="../signin.html" className={"menu__link"}>
                    Войти
                  </a>
                </li>
              </ul>
            </div>
          </nav>
          <div className={"centerblock"}>
            <div className={"centerblock__search"}>
              <svg className={"search__svg"}>
                <use xlinkHref="/img/icon/sprite.svg#icon-search"></use>
              </svg>
              <input
                className={"search__text"}
                type="search"
                placeholder="Поиск"
                name="search"
              />
            </div>
            <h2 className={"centerblock__h2"}>Треки</h2>
            <div className={"centerblock__filter"}>
              <div className={"filter__title"}>Искать по:</div>
              <div className={"filter__button"}>исполнителю</div>
              <div className={"filter__button"}>году выпуска</div>
              <div className={"filter__button"}>жанру</div>
            </div>
            <div className={"centerblock__content"}>
              <div className={"content__title"}>
                <div className={"playlistTitle__col col01"}>Трек</div>
                <div className={"playlistTitle__col col02"}>Исполнитель</div>
                <div className={"playlistTitle__col col03"}>Альбом</div>
                <div className={"playlistTitle__col col04"}>
                  <svg className={"playlistTitle__svg"}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-watch"></use>
                  </svg>
                </div>
              </div>
              <div className={"content__playlist"}>
                <div className={"playlist__item"}>
                  <div className={"playlist__track"}>
                    <div className={"track__title"}>
                      <div className={"track__titleImage"}>
                        <svg className={"track__titleSvg"}>
                          <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                        </svg>
                      </div>
                      <div className="track__title-text">
                        <a className={"track__titleLink"} href="">
                          Guilt <span className={"track__titleSpan"}></span>
                        </a>
                      </div>
                    </div>
                    <div className={"track__author"}>
                      <a className={"track__authorLink"} href="">
                        Nero
                      </a>
                    </div>
                    <div className={"track__album"}>
                      <a className={"track__albumLink"} href="">
                        Welcome Reality
                      </a>
                    </div>
                    <div className="track__time">
                      <svg className={"track__timeSvg"}>
                        <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                      </svg>
                      <span className={"track__timeText"}>4:44</span>
                    </div>
                  </div>
                </div>

                <div className={"playlist__item"}>
                  <div className={"playlist__track"}>
                    <div className={"track__title"}>
                      <div className={"track__titleImage"}>
                        <svg className={"track__titleSvg"}>
                          <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                        </svg>
                      </div>
                      <div className="track__title-text">
                        <a className={"track__titleLink"} href="">
                          Elektro <span className={"track__titleSpan"}></span>
                        </a>
                      </div>
                    </div>
                    <div className={"track__author"}>
                      <a className={"track__authorLink"} href="">
                        Dynoro, Outwork, Mr. Gee
                      </a>
                    </div>
                    <div className={"track__album"}>
                      <a className={"track__albumLink"} href="">
                        Elektro
                      </a>
                    </div>
                    <div className="track__time">
                      <svg className={"track__timeSvg"}>
                        <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                      </svg>
                      <span className={"track__timeText"}>2:22</span>
                    </div>
                  </div>
                </div>

                <div className={"playlist__item"}>
                  <div className={"playlist__track"}>
                    <div className={"track__title"}>
                      <div className={"track__titleImage"}>
                        <svg className={"track__titleSvg"}>
                          <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                        </svg>
                      </div>
                      <div className="track__title-text">
                        <a className={"track__titleLink"} href="">
                          I’m Fire <span className={"track__titleSpan"}></span>
                        </a>
                      </div>
                    </div>
                    <div className={"track__author"}>
                      <a className={"track__authorLink"} href="">
                        Ali Bakgor
                      </a>
                    </div>
                    <div className={"track__album"}>
                      <a className={"track__albumLink"} href="">
                        I’m Fire
                      </a>
                    </div>
                    <div className="track__time">
                      <svg className={"track__timeSvg"}>
                        <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                      </svg>
                      <span className={"track__timeText"}>2:22</span>
                    </div>
                  </div>
                </div>

                <div className={"playlist__item"}>
                  <div className={"playlist__track"}>
                    <div className={"track__title"}>
                      <div className={"track__titleImage"}>
                        <svg className={"track__titleSvg"}>
                          <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                        </svg>
                      </div>
                      <div className="track__title-text">
                        <a className={"track__titleLink"} href="">
                          Non Stop
                          <span className={"track__titleSpan"}>(Remix)</span>
                        </a>
                      </div>
                    </div>
                    <div className={"track__author"}>
                      <a className={"track__authorLink"} href="">
                        Стоункат, Psychopath
                      </a>
                    </div>
                    <div className={"track__album"}>
                      <a className={"track__albumLink"} href="">
                        Non Stop
                      </a>
                    </div>
                    <div className="track__time">
                      <svg className={"track__timeSvg"}>
                        <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                      </svg>
                      <span className={"track__timeText"}>4:12</span>
                    </div>
                  </div>
                </div>

                <div className={"playlist__item"}>
                  <div className={"playlist__track"}>
                    <div className={"track__title"}>
                      <div className={"track__titleImage"}>
                        <svg className={"track__titleSvg"}>
                          <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                        </svg>
                      </div>
                      <div>
                        <a className={"track__titleLink"} href="">
                          Run Run
                          <span className={"track__titleSpan"}>
                            (feat. AR/CO)
                          </span>
                        </a>
                      </div>
                    </div>
                    <div className={"track__author"}>
                      <a className={"track__authorLink"} href="">
                        Jaded, Will Clarke, AR/CO
                      </a>
                    </div>
                    <div className={"track__album"}>
                      <a className={"track__albumLink"} href="">
                        Run Run
                      </a>
                    </div>
                    <div className="track__time">
                      <svg className={"track__timeSvg"}>
                        <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                      </svg>
                      <span className={"track__timeText"}>2:54</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={"main__sidebar"}>
            <div className={"sidebar__personal"}>
              <p className={"sidebar__personalName"}>Sergey.Ivanov</p>
              <div className={"sidebar__icon"}>
                <svg>
                  <use xlinkHref="/img/icon/sprite.svg#logout"></use>
                </svg>
              </div>
            </div>
            <div className={"sidebar__block"}>
              <div className={"sidebar__list"}>
                <div className={"sidebar__item"}>
                  <a className={"sidebar__link"} href="#">
                    <Image
                      className={"sidebar__img"}
                      src="/playlist01.png"
                      alt="day's playlist"
                      width={250}
                      height={170}
                    />
                  </a>
                </div>
                <div className={"sidebar__item"}>
                  <a className={"sidebar__link"} href="#">
                    <Image
                      className={"sidebar__img"}
                      src="/playlist02.png"
                      alt="day's playlist"
                      width={250}
                      height={170}
                    />
                  </a>
                </div>
                <div className={"sidebar__item"}>
                  <a className={"sidebar__link"} href="#">
                    <Image
                      className={"sidebar__img"}
                      src="/playlist03.png"
                      alt="day's playlist"
                      width={250}
                      height={170}
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
        <div className={"bar"}>
          <div className={"bar__content"}>
            <div className={"bar__playerProgress"}></div>
            <div className={"bar__playerBlock"}>
              <div className={"bar__player"}>
                <div className={"player__controls"}>
                  <div className={"player__btnPrev"}>
                    <svg className={"player__btnPrevSvg"}>
                      <use xlinkHref="/img/icon/sprite.svg#icon-prev"></use>
                    </svg>
                  </div>
                  <div className={"player__btnPlay btn"}>
                    <svg className={"player__btnPlaySvg"}>
                      <use xlinkHref="/img/icon/sprite.svg#icon-play"></use>
                    </svg>
                  </div>
                  <div className={"player__btnNext"}>
                    <svg className={"player__btnNextSvg"}>
                      <use xlinkHref="/img/icon/sprite.svg#icon-next"></use>
                    </svg>
                  </div>
                  <div className={"player__btnRepeat btnIcon"}>
                    <svg className={"player__btnRepeatSvg"}>
                      <use xlinkHref="/img/icon/sprite.svg#icon-repeat"></use>
                    </svg>
                  </div>
                  <div className={"player__btnShuffle btnIcon"}>
                    <svg className={"player__btnShuffleSvg"}>
                      <use xlinkHref="/img/icon/sprite.svg#icon-shuffle"></use>
                    </svg>
                  </div>
                </div>

                <div className={"player__trackPlay"}>
                  <div className={"trackPlay__contain"}>
                    <div className={"trackPlay__image"}>
                      <svg className={"trackPlay__svg"}>
                        <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                      </svg>
                    </div>
                    <div className={"trackPlay__author"}>
                      <a className={"trackPlay__authorLink"} href="">
                        Ты та...
                      </a>
                    </div>
                    <div className={"trackPlay__album"}>
                      <a className={"trackPlay__albumLink"} href="">
                        Баста
                      </a>
                    </div>
                  </div>

                  <div className={"trackPlay__dislike"}>
                    <div className={"player__btnShuffle btnIcon"}>
                      <svg className={"trackPlay__likeSvg"}>
                        <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                      </svg>
                    </div>
                    <div className={"trackPlay__dislike btnIcon"}>
                      <svg className={"trackPlay__dislikeSvg"}>
                        <use xlinkHref="/img/icon/sprite.svg#icon-dislike"></use>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className={"bar__volumeBlock"}>
                <div className={"volume__content"}>
                  <div className={"volume__image"}>
                    <svg className={"volume__svg"}>
                      <use xlinkHref="/img/icon/sprite.svg#icon-volume"></use>
                    </svg>
                  </div>
                  <div className={"volume__progress btn"}>
                    <input
                      className={"volume__progressLine btn"}
                      type="range"
                      name="range"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="footer"></footer>
      </div>
    </div>
  );
}
