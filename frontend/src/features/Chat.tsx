import type { Config } from "../types/Component"
import Button from "../components/Button"
import Base from "../components/Base"
import Textarea from "../components/Textarea"
import COMP from "../const/component"
import Standard from "../dialogs/Standard"
import HashHelper from "../helpers/HashHelper"
import DataHelper from "../helpers/DataHelper"
import type { Answer, MessageSelect, Message } from "../types/Chat"
import { Message as ChatMessage } from "./Message"
import Node from '../components/Node'

export default function History(): Config {
  const config: Config = new Base({
    key: "history",
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
      new Base({
        className: "columnReverse overflowAuto paddingLarge",
        messages: [],
        states: COMP.STATES.BASE.concat([ "messages" ]),
        onInit: function(){
          this.updateChat();
        },
        updateChat: function( offset: number ){
          const id = HashHelper.id();
          if( id === "new" ){
            this.state.messages.setter( [] );
            return;
          }
          this.request({
            url: "http://localhost:5000/message/select",
            data: {
              chat: id,
              limit: 20,
              offset: offset || 0
            },
            success: function( data: MessageSelect ){
              let messages;
              if( offset ){
                messages = this.state.messages.value.concat( data.messages )
              }
              else messages = data.messages;
              
              this.state.messages.setter( messages );
            },
            error: function( data: any ){
              this.openDialog(Standard({
                type: COMP.DIALOG.TYPE.ERROR,
                title: "Message Select Failed",
                message: data.message
              }));
            }
          });
        },
        events: [
          {
            type: "hashchange",
            node: window,
            callback: function(){
              this.updateChat();
            }
          }
        ],
        setJSX: function(){
          const messages: Message[] = this.state.messages.value;
          return (
            <div ref={this.domRef} className={this.className}>
              {
                messages.map(( message, index ) => {
                  return ( <Node key={index} config={ChatMessage( message )}/> )
                })
              }
            </div>
          );
        }
      }),
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
  });
  return config;
}
