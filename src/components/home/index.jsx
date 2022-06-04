import cn from 'classnames'
import React from 'react'
import config from '../../config.json'
import Page from '../common/layout/Page'
import Header from '../common/util/Header'

const Home = () => {
return (
<Page>
<Header title={config.market_title} description={config.market_description} image={config.market_image} />
    <div className={cn('container mx-auto my-20')}>
    <center><img src="https://i.ibb.co/S7c64D0/featuredstatic.png" width="600" height="228"/></center>
    <center><table>
    <tbody>
    <tr>
    <td></td>
    <td></td>
    <td></td>
    </tr>
    <tr>
    <td><a href="https://t.me/+q6bJLAyhR01kZjJh">Get Featured</a></td>
    <td><img src="https://i.ibb.co/c10WDBS/tranpicon.png"/></td>
    <td><a href="http://dablabs.io/collection/themetagirls"><img src="https://i.ibb.co/CtkBLwF/TMGanimated-Bann.gif" width="600" height="228" align="right"/></a><center><a href="https://themetagirls.space">Mine TMG Here!</a></center></td></tr>
    </tbody>
    </table></center>
    </div>
</Page>


)


}



export default Home
