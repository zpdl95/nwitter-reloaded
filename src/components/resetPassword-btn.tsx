export default function ResetPasswordBtn() {
  const onClick = () => {
    console.log('reset Password');
  };
  return (
    <button type='button' onClick={onClick}>
      비밀번호를 잊으셨나요?
    </button>
  );
}
