
/**
 * 判断设备是否是移动端
 */
export const opinion = () => {
    if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        return true;
    }else {
        return false;
    }
}