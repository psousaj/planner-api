import { AuthGuard } from '@/auth/auth.guard';
import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

@Controller('redirect')
export class RedirectController {

    // @UseGuards(AuthGuard)
    @Get()
    redirectToDeepLink(@Query('trip_id') tripId: string, @Query('participant_id') participantId: string, @Req() req: FastifyRequest, @Res() res: FastifyReply) {
        const userAgent = req.headers['user-agent'];
        const deepLink = `planner://trip/${tripId}?participant=${participantId}`;

        if (/mobile/i.test(userAgent)) {
            // Redireciona para o deep link se for um dispositivo móvel
            res.redirect(deepLink);
        } else {
            // Exibe uma página web se for um navegador de desktop
            res.type('text/html').send(`
        <html>
          <head>
            <title>Redirecionando...</title>
          </head>
          <body>
            <p>Você será redirecionado para o aplicativo Plann.er.</p>
            <script>
              // Tenta abrir o aplicativo móvel
              window.location.href = '${deepLink}';
              // Após 2 segundos, redireciona para a página web se o aplicativo não abrir
              setTimeout(function() {
                window.location.href = 'https://planner.crudbox.com.br/web-version?trip_id=${tripId}&participant_id=${participantId}';
              }, 2000);
            </script>
          </body>
        </html>
      `);
        }
    }
}
