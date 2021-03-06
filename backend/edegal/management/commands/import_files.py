import argparse

from django.core.management import BaseCommand

from ...importers.filesystem import FilesystemImporter


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('input_filenames', nargs='+', metavar='INPUT_FILE')
        parser.add_argument('-p', '--path', required=True)
        parser.add_arguments('-m', '--mode', choices=('copy', 'move', 'inplace'), default='copy')

    def handle(self, *args, **options):
        FilesystemImporter(
            path=options['path'],
            input_filenames=options['input_filenames'],
            mode=options['mode'],
        ).run()
