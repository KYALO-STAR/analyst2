import { useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';

type MenuHeaderProps = {
    hideLanguageSetting?: boolean;
    openLanguageSetting?: () => void;
};

const MenuHeader = ({ hideLanguageSetting = false, openLanguageSetting }: MenuHeaderProps) => {
    const { localize, currentLang } = useTranslations();
    const { isDesktop } = useDevice();

    return (
        <div className='mobile-menu__header'>
            <Text size={isDesktop ? 'md' : 'lg'} weight='bold'>
                {localize('Menu')}
            </Text>
            {!hideLanguageSetting && (
                <button type='button' className='mobile-menu__lang-btn' onClick={openLanguageSetting}>
                    {currentLang}
                </button>
            )}
        </div>
    );
};

export default MenuHeader;
