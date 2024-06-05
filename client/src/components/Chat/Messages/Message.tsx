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
                      if (window.Asc.plugin.info.editorType === 'word') {
                        window.Asc.plugin.executeMethod('PasteHtml', [element?.innerHTML]);
                      }else {
                        console.log('get json');
                        window.Asc.plugin.callCommand(function() {
                          const oPresentation = Api.GetPresentation();
                          const oSlide = oPresentation.GetCurrentSlide();
                          const json = oSlide.ToJSON(false, true, true, false);
                          console.log(json);
                          return json;
                        },false,false, function(result) {
                          fetch('/test', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'MessageId': messageId,
                            },
                            body: result,
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
                            const json = JSON.parse(event.data);
                            eval(`window.Asc.plugin.callCommand(function(data) {
                              const oPresentation = Api.GetPresentation();
                              const oSlide = oPresentation.GetCurrentSlide();
                              var nCurrentSlideIndex = oPresentation.GetCurSlideIndex();
                              var oMaster = oPresentation.GetMaster(0);
                              const oSlideFromJSON = Api.FromJSON('${event.data}');
                              oPresentation.AddSlide(oSlideFromJSON);
                              oSlideFromJSON.ApplyLayout(oMaster.GetLayout(${json.layout}));
                              Api.Save();
                            });
                            `);
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
