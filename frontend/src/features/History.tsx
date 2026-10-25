import type { Config } from "../types/Component"
import Button from "../components/Button"
import Base from "../components/Base"
import COMP from "../const/component"
import Standard from "../dialogs/Standard"

export default function History(): Config{
  const config: Config = {
    className: "column",
    children: [
      new Base({
        className: "flexNone borderSolid borderBottomTiny lighterBorderColor paddingSmall",
        children: [
          new Button({
            text: "💬 New",
            onClick: function(){
              window.location.hash = "chat/new";
            }
          }),
          new Button({
            type: COMP.BUTTON.TYPE.BORDER,
            className: "marginLeftSmall errorColor errorBorderColor",
            text: "🗑 Delete All",
            onClick: function(){
              const self = this;
              this.openDialog(Standard({
                type: COMP.DIALOG.TYPE.WARNING,
                message: "Do you want to delete all chats?",
                confirm: function(){
                  self.request({
                    url: "http://localhost:5000/chat/delete",
                    success: function(){
                      self.openDialog(Standard({
                        type: COMP.DIALOG.TYPE.SUCCESS,
                        title: "Delete All Success",
                        message: "Everything is deleted"
                      }));
                    },
                    error: function( data: any ){
                      self.openDialog(Standard({
                        type: COMP.DIALOG.TYPE.ERROR,
                        title: "Delete All Failed",
                        message: data.message
                      }));
                    }
                  });
                }
              }));
            }
          })
        ]
      })
    ]
  };
  return new Base( config );
}
