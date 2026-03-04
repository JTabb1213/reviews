import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

const LoginPrompt = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(160deg, #faf7f2 0%, #f0ebe3 100%);
  padding: 20px;
`;

const NeedToLoginBox = styled.div`
  background: #ffffff;
  padding: 40px 36px;
  text-align: center;
  max-width: 380px;
  width: 100%;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3436;
  line-height: 1.5;
`;

const GoBackButton = styled.button`
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.03em;
  color: #e17055;
  background: transparent;
  border: 2px solid #e17055;
  padding: 11px 28px;
  margin-top: 20px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.25s cubic-bezier(.4,0,.2,1);

  &:hover {
    background: #e17055;
    color: #fff;
    box-shadow: 0 4px 14px rgba(225, 112, 85, 0.35);
    transform: translateY(-1px);
  }
`;

const LoginButtonStyled = styled.button`
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 0.03em;
  background: linear-gradient(135deg, #00b894, #00a381);
  color: #fff;
  border: none;
  padding: 12px 32px;
  margin-top: 12px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.25s cubic-bezier(.4,0,.2,1);

  &:hover {
    box-shadow: 0 4px 14px rgba(0, 184, 148, 0.4);
    transform: translateY(-1px);
  }
`;

function BadLoginPage() {
  //const location = useLocation();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url') || '';
  const questionMarkIndex = redirectUrl.indexOf('=');//Could not find id query param for some reason, so I just split the string where the '=' was
  const id = questionMarkIndex !== -1 ? redirectUrl.substring(questionMarkIndex + 1) : null;

  useEffect(() => {
    console.log("Component mounted");
    return () => {
      console.log("Component unmountedffff");
    };
  }, []);

  const handleGoBack = () => {
    navigate(redirectUrl || '/');
  }

  const handleLogin = () => {
    navigate({
      pathname: '/loginpage',
      search: `redirect_url=/reviewpage?id=${id}`,
    })
  }

  return (
    <LoginPrompt>
      <NeedToLoginBox>
        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔒</div>
        You need to log in to add a review
        <br />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <LoginButtonStyled onClick={handleLogin}>Log in</LoginButtonStyled>
          <GoBackButton onClick={handleGoBack}>Go back</GoBackButton>
        </div>
      </NeedToLoginBox>
    </LoginPrompt>
  );
}

export default BadLoginPage;
