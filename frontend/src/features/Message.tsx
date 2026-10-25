import type { Config } from "../types/Component"
import type { Message } from "../types/Chat"
import Base from "../components/Base"

export function Message( data: Message ): Config{
  const config: Config = new Base({
    key: "message",
    className: "flexNone marginTopLarge" + ( data.role === "user" ? " justifyContentEnd" : "" ),
    children: [
        new Base({
            className: "message flexNone paddingSmall" + ( data.role === "user" ? " lighterBackgroundColor borderRadiusMedium" : "" ),
            setJSX: function(){
                return (
                    <div ref={this.domRef} className={this.className}>
                        { data.content }
                    </div>
                );
            }
        })
    ]
  });
  return config;
}
