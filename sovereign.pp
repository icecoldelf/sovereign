mod 'puppet-nodejs', '6.0.0'

class { 'nodejs':
    repo_url_suffix => '10.x',
}