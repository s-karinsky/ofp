import cn from 'classnames'
import Accordion from '@components/Accordion'
import Button from '@components/Button'
import Checkbox from '@components/Checkbox'
import Input from '@components/Input'
import Slider from '@components/Slider'
import styles from './Home.module.scss'

export default function Home() {
    return (
        <div className={styles.home}>
            <div className={styles.homeTop}>
                <div className={styles.homeTopTitle}>
                    Сервис продажи готовых<br />ортофотопланов<br />и съемки с БПЛА
                </div>
                <div className={styles.homeTopButton}>
                    <Button
                        href="/map"
                        color="white"
                        height="92px"
                        className={styles.homeTopMapButton}
                        fullSize
                    >
                        КАРТА
                    </Button>
                </div>
                <div className={styles.homeHow}>
                    <div className="container">
                        <h1 className={styles.title}>Как это работает?</h1>
                        <ul className={styles.howWork}>
                            <li className={styles.howWorkItem}>
                                <div
                                    className={styles.howWorkBlock}
                                    style={{
                                        backgroundImage: 'url(/how1.svg)'
                                    }}
                                />
                                <div className={styles.howWorkTitle}>Покупка</div>
                                <div className={styles.howWorkText}>
                                    <p>
                                        <b>Поиск объекта интереса</b><br />
                                        название населенного пункта<br />
                                        географические координаты <br />
                                    </p>
                                    <p>
                                        <b>Период съемки</b><br />
                                        3 месяца<br />
                                        6 месяцев<br />
                                        выбранный диапазон <br />
                                        всё время
                                    </p>
                                    <p>
                                        <b>Выбор области</b><br />
                                        полигон<br />
                                        квадрат<br />
                                        загружаемый файл
                                    </p>
                                </div>
                            </li>
                            <li className={styles.howWorkItem}>
                                <div
                                    className={styles.howWorkBlock}
                                    style={{
                                        backgroundImage: 'url(/how2.svg)'
                                    }}
                                />
                                <div className={styles.howWorkTitle}>Поиск</div>
                                <div className={styles.howWorkText}>
                                    <p>
                                        Для ортофотопланов, попавших в область поиска, 
                                        можно загрузить <b>предварительный просмотр</b>.
                                    </p>
                                    <p>
                                        Предпросмотр демонстрирует ортофотоплан в низком 
                                        качестве и его характеристики. 
                                        Подходящие снимки добавляются в корзину.
                                    </p> 
                                    <p>
                                        Доступна опция заказа новой съемки на выделенную 
                                        территорию интереса из интерфейса геосервиса.
                                    </p>
                                </div>
                            </li>
                            <li className={styles.howWorkItem}>
                                <div
                                    className={styles.howWorkBlock}
                                    style={{
                                        backgroundImage: 'url(/how3.svg)'
                                    }}
                                />
                                <div className={styles.howWorkTitle}>Заказ</div>
                                <div className={styles.howWorkText}>
                                    <p>
                                        Заказ с добавленными <b>в корзину</b> ортофотопланами 
                                        или заявкой на съемку становится доступным для 
                                        <b>онлайн-оплаты</b> по кредитной или дебетовой карте.
                                    </p>
                                    <p>
                                        Стоимость некоторых частей снимков может уточнятся 
                                        менеджером какое-то время.
                                    </p>
                                    <p>
                                        Для юридических лиц доступна опция оплаты заказа по счету.
                                    </p>
                                </div>
                            </li>
                            <li className={styles.howWorkItem}>
                                <div
                                    className={styles.howWorkBlock}
                                    style={{
                                        backgroundImage: 'url(/how4.svg)'
                                    }}
                                />
                                <div className={styles.howWorkTitle}>Предварительный просмотр</div>
                                <div className={styles.howWorkText}>
                                    <p>
                                        После завершения обработки платежа оплаченные 
                                        ортофотопланы становятся доступными для скачивания 
                                        из личного кабинета  или по ссылке, автоматически 
                                        направляемой на электронную почту пользователя, 
                                        указанную в заявке.
                                    </p>
                                    <p>
                                        Для осуществления новой съемки ортофотоплана требуется какое-то время.
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={styles.homeMiddle}></div>

                <div className={styles.benefits}>
                    <div className="container">
                        <h1 className={styles.title}>
                            Наши преимущества
                            <div className={styles.subtitle}>Почему нас выбирают</div>
                        </h1>
                        <ul className={styles.benefitsList}>
                            <li className={styles.benefitsItem}>
                                <div
                                    style={{ backgroundImage: 'url(/benefits1.svg)' }}
                                    className={styles.benefitsIcon}
                                />
                                <div className={styles.benefitsText}>
                                    Охват больших территорий
                                </div>
                            </li>
                            <li className={styles.benefitsItem}>
                                <div
                                    style={{ backgroundImage: 'url(/benefits2.svg)' }}
                                    className={styles.benefitsIcon}
                                />
                                <div className={styles.benefitsText}>
                                    Заказ съемки в любое время года
                                </div>
                            </li>
                            <li className={styles.benefitsItem}>
                                <div
                                    style={{ backgroundImage: 'url(/benefits3.svg)' }}
                                    className={styles.benefitsIcon}
                                />
                                <div className={styles.benefitsText}>
                                    Выбор параметров ортофотопланов
                                </div>
                            </li>
                            <li className={styles.benefitsItem}>
                                <div
                                    style={{ backgroundImage: 'url(/benefits4.svg)' }}
                                    className={styles.benefitsIcon}
                                />
                                <div className={styles.benefitsText}>
                                    Наличие готовых ортофотопланов
                                </div>
                            </li>
                            <li className={styles.benefitsItem}>
                                <div
                                    style={{ backgroundImage: 'url(/benefits5.svg)' }}
                                    className={styles.benefitsIcon}
                                />
                                <div className={styles.benefitsText}>
                                    Высокая точность сбора данных
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={styles.usage}>
                    <div className={cn("container", styles.usageContainer)}>
                        <h1 className={styles.title}>
                            Где применяется?
                            <div className={styles.subtitle}>Области применения</div>
                        </h1>
                        <div className={styles.sliderWrapper}>
                            <Slider slidesToShow={3}>
                                <div>
                                    <div className={styles.slideImage}>
                                        <img src="/slide1.png" width="100%" />
                                    </div>
                                    <div className={styles.slideText}>
                                        Промышленные объекты
                                    </div>
                                </div>
                                <div>
                                    <div className={styles.slideImage}>
                                        <img src="/slide2.png" width="100%" />
                                    </div>
                                    <div className={styles.slideText}>
                                        Сельское хозяйство
                                    </div>
                                </div>
                                <div>
                                    <div className={styles.slideImage}>
                                        <img src="/slide3.png" width="100%" />
                                    </div>
                                    <div className={styles.slideText}>
                                        Строительство
                                    </div>
                                </div>
                            </Slider>
                        </div>
                        <div className={styles.partnerButton}>
                            <Button width="530px" height="100px" href="/">
                                Стать партнёром
                            </Button>
                        </div>
                    </div>

                    <div className={cn("container", styles.faq)}>
                        <h1 className={styles.title}>
                            Часто задаваемые вопросы
                            <div className={styles.subtitle}>Основные и дополнительные</div>
                        </h1>
                        <div className={styles.accordion}>
                            <Accordion title="Сколько стоит доставка с примеркой в пределах МКАД?">
                                Стоимость доставки в пределах МКАД - 300р.<br />
                                Дата возможной доставки с примеркой согласовывается с менеджером.<br />
                                Доставка осуществляется в будние дни c 9-00 до 19-00.
                            </Accordion>
                            <Accordion title="Возможна ли доставка в выходной?">
                                Стоимость доставки в пределах МКАД - 300р.<br />
                                Дата возможной доставки с примеркой согласовывается с менеджером.<br />
                                Доставка осуществляется в будние дни c 9-00 до 19-00.
                            </Accordion>
                            <Accordion title="Возможна ли доставка с примеркой за МКАД и по Московской области?">
                                Стоимость доставки в пределах МКАД - 300р.<br />
                                Дата возможной доставки с примеркой согласовывается с менеджером.<br />
                                Доставка осуществляется в будние дни c 9-00 до 19-00.
                            </Accordion>
                            <Accordion title="Не нашли ответ на ваш вопрос?">
                                Стоимость доставки в пределах МКАД - 300р.<br />
                                Дата возможной доставки с примеркой согласовывается с менеджером.<br />
                                Доставка осуществляется в будние дни c 9-00 до 19-00.
                            </Accordion>
                        </div>
                    </div>
                    
                    <div className="container">
                        <h1 className={styles.title}>
                            Проконсультируем по любым вопросам
                            <div className={styles.subtitle}>Заполни форму обратной связи</div>
                        </h1>
                    </div>
                    <div className={styles.contactForm}>
                        <div className="container">
                            <div className={styles.contactInput}>
                                <Input placeholder="Имя" />
                            </div>
                            <div className={styles.contactInput}>
                                <Input placeholder="E-mail" type="email" />
                            </div>
                            <div className={styles.contactInput}>
                                <Input placeholder="Телефон" />
                            </div>
                            <div className={styles.contactInput}>
                                <Input type="textarea" placeholder="Введите данные вашего запроса" className={styles.contactText} />
                            </div>
                            <div className={styles.contactInput}>
                                <Checkbox>Я даю согласие на обработку  персональных данных</Checkbox>
                            </div>
                            <div className={styles.contactInput}>
                                <Button color="white" width="335px">Отправить</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}