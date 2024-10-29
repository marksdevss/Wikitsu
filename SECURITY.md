# Security Policy

## Reporting a Vulnerability

Se você encontrar uma vulnerabilidade de segurança, entre em contato conosco diretamente em []. Por favor, não abra um problema no GitHub. Queremos garantir que as vulnerabilidades sejam tratadas de forma responsável.

## Supported Versions

As versões atuais suportadas do Wikitsu são:

- Última versão estável (v1.0.0)

## Security Updates

Todos os updates relacionados a segurança serão notificados através da [seção de releases](https://github.com/marksdevss/Wikitsu/releases) deste repositório.

## Guidelines for Contributions

1. **Dependências**: Utilize o `npm audit` para verificar vulnerabilidades nas dependências do projeto.
2. **Code Reviews**: Todas as pull requests devem ser revisadas quanto à segurança antes de serem mescladas.
3. **Segredos**: Não adicione chaves de API ou outros segredos diretamente no código. Utilize variáveis de ambiente e o arquivo `.env` para armazená-los.
