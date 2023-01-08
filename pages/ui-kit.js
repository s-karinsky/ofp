import { useDispatch } from 'react-redux'
import Button from '@components/Button'
import { Checkbox, Input } from '@components/Form'
import Popup, { PopupOverlay } from '@components/Popup'
import { showPopup } from '@store/popup'

export default function uiKit() {
    const dispatch = useDispatch()

    return (
        <div>
            <Button size="large" fullSize>Fullsize large button</Button>
            <Button color="white" type="submit">White button</Button>
            <Button width="50px" height="50px" disabled>Icon</Button>
            
            <Checkbox disabled>
                Запомнить меня
            </Checkbox>
            <Checkbox>
                Запомнить меня<br />И проверить<br />многострочный текст
            </Checkbox>
            <Input placeholder="Test" defaultValue="Value" size="small" error="Поле не заполнено" required />
            <Input placeholder="56.346556" size="xsmall" />
            <Input placeholder="Password" size="xsmall" type="password" label="Старый пароль" required />
            <Input placeholder="12321" onChange={() => dispatch(showPopup('test'))} options={[
                {
                    value: '1',
                    label: 'One'
                }, {
                    value: '2',
                    label: 'Two'
                }
            ]} />
            <Popup name="test" title="test popup">
                sdfgsdf<br/>sdfgsdf<br/>sdfgsdf<br/>sdfgsdf<br/>sdfgsdf<br/>
                sdfgsdf<br/>sdfgsdf<br/>sdfgsdf<br/>sdfgsdf<br/>sdfgsdf<br/>
            </Popup>
        </div>
    )
}