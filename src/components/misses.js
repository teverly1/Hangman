import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFaceGrin, faFaceMeh, faFaceDizzy, faFaceRollingEyes, faFaceSurprise, faFaceTired, faSlash } from '@fortawesome/free-solid-svg-icons'

function Misses({missedCount=0}){
    const faces = [faFaceGrin,faFaceMeh, faFaceRollingEyes, faFaceSurprise, faFaceTired, faFaceDizzy],
          hide = " hide";
    let bodyExtraCls = hide,
        leftArmExtraCls = hide,
        rightArmExtraCls = hide,
        leftLegExtraCls = hide,
        rightLegExtraCls = hide;

    if(missedCount>0)
    {
        bodyExtraCls = '';
        if(missedCount>1)
        {
            leftArmExtraCls = '';
            if(missedCount>2)
            {
                rightArmExtraCls = '';
                if(missedCount>3)
                {
                    leftLegExtraCls='';
                    if(missedCount>4)
                    {
                        rightLegExtraCls='';
                    }
                }
            }
        }
    }
    return <div className="misses">
        <div className="head" key={5}>
            <FontAwesomeIcon icon={faces[Math.min(faces.length,missedCount)]} />
        </div>
        <div className={"body " + bodyExtraCls} key={1}><p>&nbsp;</p></div>
        <FontAwesomeIcon className={"left_arm" + leftArmExtraCls} icon={faSlash} key={0}/>
        <FontAwesomeIcon className={"right_arm" + rightArmExtraCls} icon={faSlash}  key={2}/>
        <FontAwesomeIcon className={"left_leg" + leftLegExtraCls} icon={faSlash}  key={3}/>
        <FontAwesomeIcon className={"right_leg"  +rightLegExtraCls} icon={faSlash}  key={4}/>
    </div>
}

export default Misses;