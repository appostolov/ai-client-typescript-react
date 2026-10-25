import type { Config } from "../types/Component"
import Base from "../components/Base"
import Button from "../components/Button"
import COMP from "../const/component"

export default function Standard( data: any ): Config{

    let fill;
    switch( data.type ){
        case COMP.DIALOG.TYPE.SUCCESS:
            fill = {
                borderColor: "successBorderColor",
                icon: "✅",
                title: "Success",
                message: "Operation successful",
                ok: "OK",
                cancel: "Cancel"
            };
            break;
        case COMP.DIALOG.TYPE.ERROR:
            fill = {
                borderColor: "errorBorderColor",
                icon: "⛔️",
                title: "Error",
                message: "Operation failed",
                ok: "OK",
                cancel: "Cancel"
            };
            break;
        case COMP.DIALOG.TYPE.WARNING:
            fill = {
                borderColor: "warningBorderColor",
                icon: "⚠️",
                title: "Warning",
                message: "Operation warning",
                ok: "OK",
                cancel: "Cancel"
            };
            break;
        default:
            fill = {
                borderColor: "mainBorderColor",
                icon: "ℹ️",
                title: "Information",
                message: "This is information dialog",
                ok: "OK",
                cancel: "Cancel"
            };
            break;
    }
    Object.assign(
        fill,
        data
    );

    const config: Config = new Base({
        key: "standard",
        className: "column backBackgroundColor borderSolid borderTiny borderRadiusSmall lighterBorderColor",
        children: [
            new Base({
                className: "flexNone alignItemsCentger borderSolid borderBottomTiny lighterBorderColor",
                children: [
                    new Base({
                        className: "flexNone alignItemsCenter paddingSmall",
                        setJSX: function(){
                            return (
                                <div className={this.className}>
                                    {fill.icon}
                                </div>
                            );
                        }
                    }),
                    new Base({
                        className: "paddingSmall alignItemsCenter",
                        setJSX: function(){
                            return (
                                <div className={this.className}>
                                    {fill.title}
                                </div>
                            );
                        }
                    }),
                    new Button({
                        type: COMP.BUTTON.TYPE.TEXT,
                        text: "✖️",
                        onClick: function(){
                            const dialog = this.getParent({ key: "dialog" });
                            dialog.remove();
                        }
                    }),
                ]
            }),
            new Base({
                className: "paddingLarge",
                setJSX: function(){
                    return (
                        <div className={this.className}>
                            {fill.message}
                        </div>
                    );
                }
            }),
            new Base({
                className: "flexNone rowReverse paddingSmall borderSolid borderTopTiny lighterBorderColor",
                children: [
                    new Button({
                        text: fill.ok,
                        onClick: function(){
                            if( data.confirm ) data.confirm();
                            else{
                                const dialog = this.getParent({ key: "dialog" });
                                dialog.remove();
                            }
                        }
                    }),
                    new Button({
                        text: fill.cancel,
                        type: COMP.BUTTON.TYPE.BORDER,
                        className: "marginRightSmall",
                        onClick: function(){
                            if( data.deny ) data.deny();
                            else{
                                const dialog = this.getParent({ key: "dialog" });
                                dialog.remove();
                            }
                        }
                    })
                ]
            })
        ]
    });
    return config;
}
