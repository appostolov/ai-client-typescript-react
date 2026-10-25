import type { Config } from "../types/Component"
import Button from "../components/Button"
import Base from "../components/Base"
import COMP from "../const/component"
import Standard from "../dialogs/Standard"
import HashHelper from "../helpers/HashHelper"
import DataHelper from "../helpers/DataHelper"

export default function History(): Config{
  const config: Config = {
    className: "column",
    children: [
      new Base({
        className: "flexNone borderSolid borderBottomTiny lighterBorderColor paddingSmall",
        children: [
          new Button({
            text: "⬅️ Back",
            onClick: function(){
              window.location.hash = "";
            }
          }),
          new Button({
            type: COMP.BUTTON.TYPE.BORDER,
            className: "marginLeftSmall errorColor errorBorderColor",
            text: "🗑 Delete",
            disabled: ( HashHelper.id() === "new" ),
            onClick: function(){
              const self = this;
              this.openDialog(Standard({
                type: COMP.DIALOG.TYPE.WARNING,
                message: "Do you want to delete this chat?",
                confirm: function(){
                  const id = HashHelper.id();
                  self.request({
                    url: "http://localhost:5000/chat/delete",
                    data: {
                      id: id
                    },
                    success: function(){
                      DataHelper.delete( id  || "" );
                      self.openDialog(Standard({
                        type: COMP.DIALOG.TYPE.SUCCESS,
                        title: "Delete Chat Success",
                        message: "The chat was deleted successfully",
                        onClose: function(){
                          debugger;
                        }
                      }));
                    },
                    error: function( data: any ){
                      self.openDialog(Standard({
                        type: COMP.DIALOG.TYPE.ERROR,
                        title: "Delete Chat Failed",
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
