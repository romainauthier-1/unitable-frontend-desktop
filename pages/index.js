
import Connection from '@/components/old/Login';
import { LoginForm } from '@/components/ui/login-form';
function Index() {

  //return LoginForm dans une div pour éviter les problèmes de style et centrer au coeur de la page

  return <div className="flex items-center justify-center min-h-screen">
    <LoginForm />;
    </div>
}

export default Index;
