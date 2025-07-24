import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Typography, Input, Button } from 'antd';
import { MessageOutlined, UserOutlined, SendOutlined } from '@ant-design/icons';

const { Title } = Typography;

const gradientBg = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';

const PageContainer = styled.div`
    min-height: 100vh;
    width: 100vw;
    background: ${gradientBg};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 0;
`;

const ChatCard = styled.div`
    width: 100%;
    max-width: 1200px; // increased from 900px
    background: linear-gradient(135deg, #fff 60%, #eaf1fb 100%);
    border-radius: 32px;
    box-shadow: 0 8px 40px 0 rgba(60, 80, 180, 0.10), 0 1.5px 8px 0 rgba(60, 80, 180, 0.04);
    margin-top: 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    min-height: 800px; // increased from 650px
    padding: 0 0 0 0;
`;

const ChatHeader = styled.div`
    width: 100%;
    padding: 40px 56px 0 56px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
`;

const ChatTitle = styled(Title)`
    && {
        font-size: 2.2rem;
        font-weight: 800;
        margin: 0;
        color: #2d3a5a;
        letter-spacing: -1px;
    }
`;

const ConversationContainer = styled.div`
    width: 100%;
    max-width: 1200px; // increased from 900px
    min-height: 600px; // increased from 400px
    max-height: 650px; // increased from 420px
    display: flex;
    flex-direction: column;
    align-items: stretch;
    overflow-y: auto;
    padding: 0 56px 24px 56px;
    scroll-behavior: smooth;
`;

const fadeInUp = keyframes`
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const MessageRow = styled.div<{ isAi: boolean, visible: boolean }>`
    display: flex;
    align-items: flex-end;
    margin-bottom: 28px;
    opacity: ${props => (props.visible ? 1 : 0)};
    flex-direction: ${props => (props.isAi ? 'row' : 'row-reverse')};
    width: 100%;
    animation: ${fadeInUp} 0.6s cubic-bezier(0.23, 1, 0.32, 1);
`;

const Avatar = styled.div<{ isAi: boolean }>`
    width: 54px;
    height: 54px;
    border-radius: 50%;
    background: ${props => (props.isAi ? 'linear-gradient(135deg, #5b9df9 0%, #3b6cb7 100%)' : '#f5f5f5')};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: ${props => (props.isAi ? '#fff' : '#666')};
    margin: 0 20px;
    border: 3px solid #fff;
    box-shadow: 0 2px 8px rgba(60, 80, 180, 0.08);
`;

const Bubble = styled.div<{ isAi: boolean }>`
    background: ${props => (props.isAi
        ? 'linear-gradient(135deg, #eaf1fb 0%, #d2e3fa 100%)'
        : '#fff')};
    color: #222;
    border-radius: 20px;
    padding: 14px 22px; // reduced padding for compactness
    max-width: 60%;
    font-size: 15px; // smaller text
    font-weight: 500;
    box-shadow: 0 2px 12px rgba(60, 80, 180, 0.06);
    border-bottom-left-radius: ${props => (props.isAi ? '8px' : '20px')};
    border-bottom-right-radius: ${props => (props.isAi ? '20px' : '8px')};
    word-break: break-word;
    transition: background 0.3s;
`;

const InputRow = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    gap: 16px;
    padding: 32px 56px 40px 56px;
    background: transparent;
    position: sticky;
    bottom: 0;
    left: 0;
    z-index: 2;
`;

const StyledInput = styled(Input)`
    font-size: 19px;
    padding: 16px 20px;
    border-radius: 16px;
    flex: 1;
    box-shadow: 0 2px 8px rgba(60, 80, 180, 0.08);
    border: 1.5px solid #eaf1fb;
    background: #f8fafc;
`;

const StyledButton = styled(Button)`
    height: 54px;
    font-size: 20px;
    border-radius: 16px;
    background: linear-gradient(135deg, #5b9df9 0%, #3b6cb7 100%);
    color: #fff;
    font-weight: 700;
    border: none;
    box-shadow: 0 2px 8px rgba(60, 80, 180, 0.10);
    transition: background 0.2s, box-shadow 0.2s;
    &:hover, &:focus {
        background: linear-gradient(135deg, #3b6cb7 0%, #5b9df9 100%);
        color: #fff;
        box-shadow: 0 4px 16px rgba(60, 80, 180, 0.16);
    }
`;

const sampleConversation = [
    { sender: 'ai', text: 'Absolutely! I’m fetching the customer feedback data for last month.' },
    { sender: 'ai', text: 'The most common positive theme was "fast delivery". The most common negative theme was "product packaging".' },
    { sender: 'human', text: 'Can you show me a word cloud of the feedback?' },
    { sender: 'ai', text: 'Here’s a word cloud visualization (imagine a graphic here). Would you like a CSV export as well?' },
    { sender: 'human', text: 'Yes, please send the CSV.' },
    { sender: 'ai', text: 'CSV export is ready! Download link: [customer_feedback_march.csv]' },
    { sender: 'human', text: 'Thank you!' },
    { sender: 'ai', text: 'You’re welcome! Let me know if you need more insights.' },
];

// Add a helper to generate a sequence of typing actions for a human message, including a typo and correction.
function getTypingSequence(text: string) {
    // For demo, let's simulate a typo on the first word longer than 4 chars
    const words = text.split(' ');
    let typoIdx = words.findIndex(w => w.length > 4);
    if (typoIdx === -1) typoIdx = 0;
    const typoWord = words[typoIdx];
    if (!typoWord || typoWord.length < 5) return [text];
    // Simulate a typo: remove last 2 chars, add a wrong char, then backspace and correct
    const typo = typoWord.slice(0, -2) + 'x';
    const beforeTypo = words.slice(0, typoIdx).join(' ');
    const afterTypo = words.slice(typoIdx + 1).join(' ');
    const typoStep = [
        (beforeTypo ? beforeTypo + ' ' : '') + typo + (afterTypo ? ' ' + afterTypo : ''),
        (beforeTypo ? beforeTypo + ' ' : '') + typo.slice(0, -1) + (afterTypo ? ' ' + afterTypo : ''), // backspace
        (beforeTypo ? beforeTypo + ' ' : '') + typoWord + (afterTypo ? ' ' + afterTypo : ''), // correct
    ];
    // Build the sequence: type up to typo, typo, backspace, correct, then finish
    const sequence = [];
    let i = 0;
    // Type up to typo
    let prefix = '';
    for (; i < typoIdx; i++) {
        prefix += (i === 0 ? '' : ' ') + words[i];
    }
    if (prefix) sequence.push(prefix);
    // Type typo
    sequence.push((prefix ? prefix + ' ' : '') + typo);
    // Backspace
    sequence.push((prefix ? prefix + ' ' : '') + typo.slice(0, -1));
    // Correct
    sequence.push((prefix ? prefix + ' ' : '') + typoWord);
    // Finish the rest
    let rest = (prefix ? prefix + ' ' : '') + typoWord;
    for (let j = typoIdx + 1; j < words.length; j++) {
        rest += ' ' + words[j];
        sequence.push(rest);
    }
    return sequence;
}

export const AgentConversationPage: React.FC = () => {
    const [messages, setMessages] = useState([
        { sender: 'human', text: 'Hello! Can you help me analyze last month’s customer feedback?' },
    ]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const [animating, setAnimating] = useState(false);
    const [typedText, setTypedText] = useState('');
    const [autoInput, setAutoInput] = useState('');
    const [autoTyping, setAutoTyping] = useState(false);
    const inputRef = useRef<Input>(null);
    const convoRef = useRef<HTMLDivElement>(null);

    // Add typingSequence and typingStep as refs or variables in the effect scope for sample conversation
    let typingSequence = null;
    let typingStep = 0;

    // Animate the sample conversation after the first message
    useEffect(() => {
        if (messages.length === 1 && !animating) {
            setAnimating(true);
            let idx = 0;
            const showNext = () => {
                if (idx < sampleConversation.length) {
                    const msg = sampleConversation[idx];
                    if (msg.sender === 'human') {
                        // Fill input, animate typing, then send
                        setAutoInput(msg.text);
                        setAutoTyping(true);
                        typingSequence = null; // Reset for each human message
                        typingStep = 0;
                        let i = 0;
                        const typeChar = () => {
                            if (!typingSequence) {
                                typingSequence = getTypingSequence(msg.text);
                                typingStep = 0;
                            }
                            if (typingStep < typingSequence.length) {
                                setTypedText(typingSequence[typingStep]);
                                typingStep++;
                                setTimeout(typeChar, 120);
                            } else {
                                setTimeout(() => {
                                    setMessages(prev => [...prev, { sender: 'human', text: msg.text }]);
                                    setTypedText('');
                                    setAutoInput('');
                                    setAutoTyping(false);
                                    typingSequence = null;
                                    typingStep = 0;
                                    idx++;
                                    showNext();
                                }, 400);
                            }
                        };
                        typeChar();
                    } else {
                        setTimeout(() => {
                            setMessages(prev => [...prev, msg]);
                            idx++;
                            showNext();
                        }, 1200);
                    }
                } else {
                    setAnimating(false);
                }
            };
            showNext();
        }
    }, [messages, animating]);

    // Animate human typing (manual input)
    useEffect(() => {
        if (typing && input.length > 0) {
            setTypedText('');
            let i = 0;
            const typeChar = () => {
                if (i <= input.length) {
                    setTypedText(input.slice(0, i));
                    i++;
                    setTimeout(typeChar, 100); // slower typing
                }
            };
            typeChar();
        }
    }, [typing, input]);

    // Auto-scroll to bottom on new message
    useEffect(() => {
        if (convoRef.current) {
            convoRef.current.scrollTop = convoRef.current.scrollHeight;
        }
    }, [messages, typing, typedText, autoTyping]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSend = () => {
        if (!input.trim()) return;
        setTyping(true);
        setTimeout(() => {
            setMessages(prev => [...prev, { sender: 'human', text: input }]);
            setTyping(false);
            setInput('');
            setTypedText('');
            inputRef.current?.focus();
        }, input.length * 40 + 300);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <PageContainer>
            <ChatCard>
                {/* Optionally add a header/title here, or leave blank for more space */}
                {/* <ChatHeader><ChatTitle>Analyst AI</ChatTitle></ChatHeader> */}
                <ConversationContainer ref={convoRef}>
                    {messages.map((msg, idx) => (
                        <MessageRow key={idx} isAi={msg.sender === 'ai'} visible={true}>
                            <Avatar isAi={msg.sender === 'ai'}>
                                {msg.sender === 'ai' ? <MessageOutlined /> : <UserOutlined />}
                            </Avatar>
                            <Bubble isAi={msg.sender === 'ai'}>{msg.text}</Bubble>
                        </MessageRow>
                    ))}
                    {typing && (
                        <MessageRow isAi={false} visible={true}>
                            <Avatar isAi={false}>
                                <UserOutlined />
                            </Avatar>
                            <Bubble isAi={false}>{typedText}</Bubble>
                        </MessageRow>
                    )}
                </ConversationContainer>
                <InputRow>
                    <StyledInput
                        ref={inputRef}
                        placeholder="Type your message..."
                        value={autoTyping ? typedText : input}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        disabled={typing || autoTyping}
                    />
                    <StyledButton
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleSend}
                        disabled={typing || autoTyping || !input.trim()}
                    >
                        Send
                    </StyledButton>
                </InputRow>
            </ChatCard>
        </PageContainer>
    );
}; 