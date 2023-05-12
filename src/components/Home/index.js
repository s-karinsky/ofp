import { useDispatch } from 'react-redux'
import cn from 'classnames'
import Link from 'next/link'
import Accordion from '@components/Accordion'
import Button from '@components/Button'
import { Checkbox, Input, Textarea } from '@components/Form'
import GreenForm from '@components/GreenForm'
import Slider from '@components/Slider'
import Spinner from '@components/Spinner'
import { showMessage } from '@store/popup'
import { isValidEmail } from '@lib/utils'
import { useForm } from '@lib/hooks'
import styles from './Home.module.scss'

export default function Home({
    usage = []
}) {
    const dispatch = useDispatch()
    const { handleSubmit, register, formState } = useForm({ action: 'contact', defaultValues: { type: 'consult' } })
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
                        <h1 className="title">Как это работает?</h1>
                        <ul className={styles.howWork}>
                            <li className={styles.howWorkItem}>
                                <div
                                    className={styles.howWorkBlock}
                                    style={{
                                        backgroundImage: 'url(/images/how3.svg)'
                                    }}
                                />
                                <div className={styles.howWorkTitle}>Поиск</div>
                                <div className={styles.howWorkText}>
                                        <p>   
                                            <b>Поиск требуемой области</b><br />
                                            название населенного пункта<br />
                                            географические координаты,<br />
                                            либо поиск по карте и выделение нужной области,<br />
                                            <b>Период съемки</b><br />
                                            3 месяца<br />
                                            6 месяцев<br />
                                            выбранный диапазон<br />
                                            всё время<br />
                                            <b>Выбор области</b><br />
                                            полигон<br />
                                            квадрат<br />
                                            загружаемый файл<br />
                                        </p>
                                </div>
                            </li>
                            <li className={styles.howWorkItem}>
                                <div
                                    className={styles.howWorkBlock}
                                    style={{
                                        backgroundImage: 'url(/images/how1.svg)'
                                    }}
                                />
                                <div className={styles.howWorkTitle}>ПРЕДВАРИТЕЛЬНЫЙ ПРОСМОТР</div>
                                <div className={styles.howWorkText}>
                                    <p>
                                    <b>Предварительный просмотр:</b><br />
                                        Для ортофотопланов, попавших в область поиска, можно загрузить предварительный просмотр.<br />
                                        Предпросмотр демонстрирует небольшую область выбранного ортофотоплана где вы можете оценить качество.<br />
                                        Доступна опция заказа новой съемки на выделенную вами территорию из интерфейса геосервиса.<br />
                                        <b>Оформление заказа</b><br />
                                        Заказ с добавленными в корзину областями, ортофотопланами или заявкой на съемку становится доступным для<br />
                                        онлайн-оплаты по кредитной или дебетовой карте.<br />
                                    </p>
                                </div>
                            </li>
                            <li className={styles.howWorkItem}>
                                <div
                                    className={styles.howWorkBlock}
                                    style={{
                                        backgroundImage: 'url(/images/how2.svg)'
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
                                        backgroundImage: 'url(/images/how4.svg)'
                                    }}
                                />
                                <div className={styles.howWorkTitle}>ПОКУПКА</div>
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
                        <h1 className="title">
                            Наши преимущества
                            <div className="subtitle">Почему нас выбирают</div>
                        </h1>
                        <ul className={styles.benefitsList}>
                            <li className={styles.benefitsItem}>
                                <div
                                    style={{ backgroundImage: 'url(/images/benefits1.svg)' }}
                                    className={styles.benefitsIcon}
                                />
                                <div className={styles.benefitsText}>
                                    Охват больших территорий
                                </div>
                            </li>
                            <li className={styles.benefitsItem}>
                                <div
                                    style={{ backgroundImage: 'url(/images/benefits2.svg)' }}
                                    className={styles.benefitsIcon}
                                />
                                <div className={styles.benefitsText}>
                                    Заказ съемки в любое время года
                                </div>
                            </li>
                            <li className={styles.benefitsItem}>
                                <div
                                    style={{ backgroundImage: 'url(/images/benefits3.svg)' }}
                                    className={styles.benefitsIcon}
                                />
                                <div className={styles.benefitsText}>
                                    Выбор параметров ортофотопланов
                                </div>
                            </li>
                            <li className={styles.benefitsItem}>
                                <div
                                    style={{ backgroundImage: 'url(/images/benefits4.svg)' }}
                                    className={styles.benefitsIcon}
                                />
                                <div className={styles.benefitsText}>
                                    Наличие готовых ортофотопланов
                                </div>
                            </li>
                            <li className={styles.benefitsItem}>
                                <div
                                    style={{ backgroundImage: 'url(/images/benefits5.svg)' }}
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
                        <h1 className="title">
                            Где применяется?
                            <div className="subtitle">Области применения</div>
                        </h1>

                        <div className={styles.usageSliderWrapper}>
                            <Slider slidesToShow={3}>
                                {usage.map(item => (
                                    <Link
                                        href={`/usage/${item.link}`}
                                        className={styles.usageLink}
                                        key={item.link}
                                    >
                                        <div className={styles.usageSlideImage}>
                                            <img src={`/images/usecases/${item.preview}`} width="100%" />
                                        </div>
                                        <div className={styles.usageSlideText}>
                                            {item.title}
                                        </div>
                                    </Link>
                                ))}
                            </Slider>
                        </div>
                    </div>
                </div>

                <div className={styles.partner}>
                    <div className={cn("container", styles.usageContainer)}>
                        <h1 className="title">
                            Как стать нашим партнером?
                            <div className="subtitle">Давай с нами делать мир лучше</div>
                        </h1>

                        <div className={styles.partnerContent}>
                            <div className={styles.partnerText}>
                                Вы занимаетесь созданием ортофотопланов и у вас уже есть готовые ортофотопланы, <b>вы можете стать нашим партнером и продать ваши ОФП</b>
                            </div>
                            <div className={styles.partnerButton}>
                                <Button width="530px" height="100px" href="/partners">
                                    Стать партнёром
                                </Button>
                                <div className={styles.partnerHint}>
                                    Мы обязательно свяжемся с Вами в ближайшее время
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div>
                    <div className="container">
                        <h1 className="title title_noline">
                            Проконсультируем по любым вопросам
                            <div className="subtitle">Заполни форму обратной связи</div>
                        </h1>
                        <GreenForm onSubmit={handleSubmit(
                            ({ data: { success } = {} } = {}) =>
                                dispatch(showMessage({
                                    icon: success ? 'success' : 'error',
                                    text: success ?
                                        'Ваше сообщение отправлено. В ближайшее время вам ответят' :
                                        'Произошла ошибка, попробуйте позже'
                            }))
                        )}>
                            <Input
                                placeholder="Имя"
                                {...register('name', { required: true })}
                            />
                            <Input
                                placeholder="E-mail"
                                type="email"
                                {...register('email', {
                                    required: true,
                                    getValidationError: val => !isValidEmail(val) && 'Введите корректный e-mail'
                                })}
                            />
                            <Input
                                placeholder="Телефон"
                                {...register('phone')}
                            />
                            <Textarea
                                type="textarea"
                                placeholder="Введите данные вашего запроса"
                                className={styles.contactText}
                                {...register('message', { required: true })}
                            />
                            <Checkbox {...register('agree', { required: true, checkbox: true })}>
                                Я даю согласие на обработку персональных данных
                            </Checkbox>
                            <Button color="white" width="335px" disabled={formState.submitting}>
                                {formState.submitting ? <Spinner /> : 'Отправить'}
                            </Button>
                        </GreenForm>
                    </div>
                </div>
            </div>
        </div>
    )
}