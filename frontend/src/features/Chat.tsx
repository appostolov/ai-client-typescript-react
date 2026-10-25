import type { Config } from "../types/Component"
import Button from "../components/Button"
import Base from "../components/Base"
import Textarea from "../components/Textarea"
import COMP from "../const/component"
import Standard from "../dialogs/Standard"
import HashHelper from "../helpers/HashHelper"
import DataHelper from "../helpers/DataHelper"
import type { Answer } from "../types/Chat"

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
      }),
      new Base({}),
      new Base({
        key: "textBlock",
        className: "flexNone column borderSolid borderTopTiny lighterBorderColor",
        onInit: function(){
          const textarea = this.getChild({ key: "textarea" });
          const button = this.getChild({ key: "send" });
          button.addEffect(
            textarea.state.text,
            ( value: string ) => {
              if( value ) button.enable()
              else button.disable()
            }
          );
        },
        children: [
          new Textarea({
            key: "textarea",
            placeholder: "Ask me anything...",
            className: "flexNone marginSmall paddingSmall fieldSizingContent"
          }),
          new Base({
            className: "flexNone paddingSmall rowReverse",
            children: [
              new Button({
                key: "send",
                text: "Send 🚀",
                disabled: true,
                onClick: function(){
                  const textBlock = this.getParent({ key: "textBlock" });
                  const textarea = textBlock.getChild({ key: "textarea" });
                  const text = textarea.getText();
                  let id = HashHelper.id();
                  if( id === "new" ) id = undefined;
                  this.request({
                    url: "http://localhost:5000/message/send",
                    data: {
                      request: {
                        messages: [
                          {
                            role: "user",
                            content: text
                          }
                        ],
                        model: 'openrouter/free'
                      },
                      chat: id
                    },
                    success: function( data: Answer ){
                      DataHelper.answer( data );
                    },
                    error: function( data: any ){
                      this.openDialog(Standard({
                        type: COMP.DIALOG.TYPE.ERROR,
                        title: "Send Message Failed",
                        message: data.message
                      }));
                    }
                  });
                }
              })
            ]
          })
        ]
      })
    ]
  };
  return new Base( config );
}
