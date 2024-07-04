import { useRecoilValue } from 'recoil';
import { useAuthContext, useMessageHelpers, useLocalize } from '~/hooks';
import type { TMessageProps } from '~/common';
import Icon from '~/components/Chat/Messages/MessageIcon';
import { Plugin } from '~/components/Messages/Content';
import MessageContent from './Content/MessageContent';
import SiblingSwitch from './SiblingSwitch';
// eslint-disable-next-line import/no-cycle
import MultiMessage from './MultiMessage';
import HoverButtons from './HoverButtons';
import SubRow from './SubRow';
import { cn } from '~/utils';
import store from '~/store';
import { SSE } from 'sse.js';

export default function Message(props: TMessageProps) {
  const UsernameDisplay = useRecoilValue<boolean>(store.UsernameDisplay);
  const { user } = useAuthContext();
  const localize = useLocalize();

  const {
    ask,
    edit,
    index,
    isLast,
    enterEdit,
    handleScroll,
    conversation,
    isSubmitting,
    latestMessage,
    handleContinue,
    copyToClipboard,
    regenerateMessage,
  } = useMessageHelpers(props);

  const { message, siblingIdx, siblingCount, setSiblingIdx, currentEditId, setCurrentEditId } =
    props;

  if (!message) {
    return null;
  }

  const { text, children, messageId = null, isCreatedByUser, error, unfinished } = message ?? {};

  let messageLabel = '';
  if (isCreatedByUser) {
    messageLabel = UsernameDisplay ? user?.name || user?.username : localize('com_user_message');
  } else {
    messageLabel = message.sender;
  }

  return (
    <>
      <div
        className="text-token-text-primary w-full border-0 bg-transparent dark:border-0 dark:bg-transparent"
        onWheel={handleScroll}
        onTouchMove={handleScroll}
      >
        <div className="m-auto justify-center p-4 py-2 text-base md:gap-6 ">
          <div className="final-completion group mx-auto flex flex-1 gap-3 text-base md:max-w-3xl md:px-5 lg:max-w-[40rem] lg:px-1 xl:max-w-[48rem] xl:px-5">
            <div className="relative flex flex-shrink-0 flex-col items-end">
              <div>
                <div className="pt-0.5">
                  <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
                    <Icon message={message} conversation={conversation} />
                  </div>
                </div>
              </div>
            </div>
            <div
              className={cn('relative flex w-11/12 flex-col', isCreatedByUser ? '' : 'agent-turn')}
            >
              <div className="select-none font-semibold">{messageLabel}</div>
              <div className="flex-col gap-1 md:gap-3">
                <div className="flex max-w-full flex-grow flex-col gap-0">
                  {/* Legacy Plugins */}
                  {message?.plugin && <Plugin plugin={message?.plugin} />}
                  <MessageContent
                    ask={ask}
                    edit={edit}
                    isLast={isLast}
                    text={text ?? ''}
                    message={message}
                    enterEdit={enterEdit}
                    error={!!error}
                    isSubmitting={isSubmitting}
                    unfinished={unfinished ?? false}
                    isCreatedByUser={isCreatedByUser ?? true}
                    siblingIdx={siblingIdx ?? 0}
                    setSiblingIdx={
                      setSiblingIdx ??
                      (() => {
                        return;
                      })
                    }
                  />
                </div>
              </div>
              {isLast && isSubmitting ? null : (
                <SubRow classes="text-xs">
                  <SiblingSwitch
                    siblingIdx={siblingIdx}
                    siblingCount={siblingCount}
                    setSiblingIdx={setSiblingIdx}
                  />
                  <HoverButtons
                    index={index}
                    isEditing={edit}
                    message={message}
                    enterEdit={enterEdit}
                    isSubmitting={isSubmitting}
                    conversation={conversation ?? null}
                    regenerate={() => regenerateMessage()}
                    copyToClipboard={copyToClipboard}
                    insertIntoEditor={ () =>  {
                      console.log('hello');
                      const element = document.getElementById(message.messageId);
                      if (window.Asc.plugin.info.editorType === 'word' ) {
                        window.Asc.plugin.executeMethod('PasteHtml', [element?.innerHTML]);
                      }else if(window.Asc.plugin.info.editorType === 'slide2') {
                        window.Asc.plugin.executeMethod('PasteHtml', [`<h1 style="font-size: 48px;">营销策略</h1>
                        <ul>
                        <li style="font-size: 24px;"><strong>产品定位和推荐策略</strong>
                        <ul>
                        <li style="font-size: 24px;"><strong>定位明确</strong>
                        <ul>
                        <li style="font-size: 24px;">明确产品的定位，确定目标用户群体，从而制定相应的推荐策略</li>
                        </ul>
                        </li>
                        <li style="font-size: 24px;"><strong>突出差异</strong>
                        <ul>
                        <li style="font-size: 24px;">在竞争激烈的市场中，通过突出产品的差异化特点，提高产品的市场占有率</li>
                        </ul>
                        </li>
                        <li style="font-size: 24px;"><strong>市场调研</strong>
                        <ul>
                        <li style="font-size: 24px;">深入了解市场和用户需求，根据结果制定针对策略，提高产品的市场竞争力</li>
                        </ul>
                        </li>
                        </ul>
                        </li>
                        </ul>`]);
                      }else {
                        console.log('get json');


                        window.Asc.plugin.callCommand(function() {
                          return Api.GetFullName();
                        },false,false, function(result) {
                          fetch('/test', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'MessageId': messageId,
                            },
                            body: JSON.stringify({ markdown: message.text, filename: result }),
                          });
                        });


                        // Create a new SSE instance
                        const sse = new SSE('/stream-sse', {
                          headers: {
                            // Optional headers
                            'Authorization': 'Bearer your_token',
                            'MessageId': messageId,
                          },
                          payload: messageId,
                          method: 'GET', // or 'POST'
                          withCredentials: true, // If you need to send cookies with the request
                        });

                        // Add an event listener for the 'message' event
                        sse.addEventListener('message', (event: MessageEvent) => {
                          console.log('Message received:', event.data);
                          if( event.data !== '') {
                            eval(event.data);
                          }
                        });

                        // Add an event listener for the 'error' event
                        sse.addEventListener('error', (event: Event) => {
                          console.error('Error occurred:', event);
                        });

                        // Start the SSE stream
                        sse.stream();
                      }
                    }}
                    handleContinue={handleContinue}
                    latestMessage={latestMessage}
                    isLast={isLast}
                  />
                </SubRow>
              )}
            </div>
          </div>
        </div>
      </div>
      <MultiMessage
        key={messageId}
        messageId={messageId}
        conversation={conversation}
        messagesTree={children ?? []}
        currentEditId={currentEditId}
        setCurrentEditId={setCurrentEditId}
      />
    </>
  );
}
